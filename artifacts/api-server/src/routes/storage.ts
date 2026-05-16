import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { createReadStream, existsSync, mkdirSync, promises as fsPromises } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { objectStorageClient, ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const LOCAL_UPLOADS_DIR = path.resolve(process.cwd(), ".uploads");

function getLocalUploadPath(objectId: string, ext: string): string {
  return path.join(LOCAL_UPLOADS_DIR, `${objectId}.${ext}`);
}

function mimeToExt(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

function localObjectIdFromObjectName(objectName: string): string | null {
  const m = objectName.match(/^uploads\/([^/]+)$/);
  return m ? m[1] : null;
}

/**
 * POST /storage/uploads
 *
 * Direct binary upload. Client sends the file bytes as the request body
 * with Content-Type set to the image mime type.
 *
 * Server tries GCS first, falls back to local disk in development.
 * Returns { objectPath } which matches the /storage/objects/* serving path.
 */
router.post("/storage/uploads", requireAdmin, async (req: Request, res: Response) => {
  const contentType = (req.headers["content-type"] ?? "").split(";")[0].trim().toLowerCase();

  if (!ALLOWED_MIME.has(contentType)) {
    res.status(400).json({ error: "Only JPG, PNG, or WEBP images are allowed" });
    return;
  }

  const clHeader = parseInt(req.headers["content-length"] ?? "0", 10);
  if (clHeader > MAX_UPLOAD_BYTES) {
    res.status(400).json({ error: "File exceeds 10MB limit" });
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const buffer = Buffer.concat(chunks);

  if (buffer.length === 0) {
    res.status(400).json({ error: "Empty file body" });
    return;
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    res.status(400).json({ error: "File exceeds 10MB limit" });
    return;
  }

  const ext = mimeToExt(contentType);
  const objectId = `${randomUUID()}.${ext}`;
  const objectName = `uploads/${objectId}`;

  const privateDir = objectStorageService.getPrivateObjectDirSafe();
  if (privateDir) {
    try {
      const fullGcsPath = `${privateDir}/${objectName}`;
      const { bucketName, objectPath: gcsObjectPath } = parseGcsPath(fullGcsPath);
      await objectStorageClient
        .bucket(bucketName)
        .file(gcsObjectPath)
        .save(buffer, { contentType, resumable: false });

      req.log.info({ objectName }, "File uploaded to GCS");
      res.json({ objectPath: `/objects/${objectName}` });
      return;
    } catch (gcsErr) {
      req.log.warn(
        { err: gcsErr },
        "GCS upload failed — falling back to local disk storage"
      );
    }
  }

  try {
    if (!existsSync(LOCAL_UPLOADS_DIR)) {
      mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
    }
    const localFilePath = path.join(LOCAL_UPLOADS_DIR, objectId);
    await fsPromises.writeFile(localFilePath, buffer);
    req.log.info({ localFilePath }, "File saved to local disk (dev fallback)");
    res.json({ objectPath: `/objects/${objectName}` });
  } catch (localErr) {
    req.log.error({ err: localErr }, "Local disk fallback also failed");
    res.status(500).json({ error: "Failed to store uploaded file" });
  }
});

/**
 * GET /storage/public-objects/*
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS.
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*
 *
 * Serve uploaded objects. Tries GCS first, then local disk fallback.
 * Only the /uploads/ prefix is publicly readable.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;

    if (!wildcardPath.startsWith("uploads/")) {
      res.status(404).json({ error: "Object not found" });
      return;
    }

    const objectPath = `/objects/${wildcardPath}`;

    try {
      const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
      const response = await objectStorageService.downloadObject(objectFile);

      res.status(response.status);
      response.headers.forEach((value, key) => res.setHeader(key, value));

      if (response.body) {
        const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
        nodeStream.pipe(res);
      } else {
        res.end();
      }
      return;
    } catch (gcsErr) {
      if (!(gcsErr instanceof ObjectNotFoundError)) {
        req.log.warn({ err: gcsErr }, "GCS fetch failed, trying local disk");
      }
    }

    const objectName = wildcardPath.replace(/^uploads\//, "");
    const localPath = path.join(LOCAL_UPLOADS_DIR, objectName);

    if (existsSync(localPath)) {
      const ext = path.extname(localPath).slice(1).toLowerCase();
      const mimeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };
      const mime = mimeMap[ext] ?? "application/octet-stream";
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      createReadStream(localPath).pipe(res);
      return;
    }

    res.status(404).json({ error: "Object not found" });
  } catch (error) {
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

function parseGcsPath(fullPath: string): { bucketName: string; objectPath: string } {
  const p = fullPath.startsWith("/") ? fullPath : `/${fullPath}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length < 2) throw new Error("Invalid GCS path");
  return { bucketName: parts[0], objectPath: parts.slice(1).join("/") };
}

export default router;
