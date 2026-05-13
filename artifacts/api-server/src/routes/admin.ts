import { Router } from "express";
import crypto from "crypto";

const router = Router();

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "fallback-dev-secret-change-in-prod";
}

function createToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + sig;
}

export function verifyToken(token: string): boolean {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return false;
    const encodedPayload = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    if (!payload.startsWith("admin:")) return false;
    const timestamp = parseInt(payload.slice("admin:".length), 10);
    if (isNaN(timestamp)) return false;
    // Token valid for 7 days
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) return false;
    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    res.status(500).json({ error: "Admin credentials not configured" });
    return;
  }

  if (
    !username ||
    !password ||
    username !== expectedUsername ||
    password !== expectedPassword
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = createToken();
  res.json({ token });
});

router.get("/admin/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ valid: false });
    return;
  }
  const token = authHeader.slice("Bearer ".length);
  const valid = verifyToken(token);
  res.json({ valid });
});

export default router;
