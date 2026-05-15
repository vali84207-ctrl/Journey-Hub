const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 0.85;
const WEBP_QUALITY = 0.85;
const SKIP_BELOW_BYTES = 400 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
      type,
      quality,
    );
  });
}

/**
 * Resize + re-encode an image client-side before upload.
 * - Skips compression for already-small files (<400KB).
 * - PNG with alpha → keeps PNG. JPG/WEBP → re-encoded to same type.
 * - Caps the long edge at 2400px.
 */
export async function compressImage(file: File): Promise<File> {
  if (!/^image\/(jpe?g|png|webp)$/i.test(file.type)) return file;
  if (file.size < SKIP_BELOW_BYTES) return file;

  try {
    const img = await loadImage(file);
    const longest = Math.max(img.width, img.height);
    const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    const isPng = /png/i.test(file.type);
    const outType = isPng ? "image/png" : file.type.toLowerCase().includes("webp") ? "image/webp" : "image/jpeg";
    const quality = outType === "image/webp" ? WEBP_QUALITY : JPEG_QUALITY;
    const blob = await canvasToBlob(canvas, outType, quality);

    if (blob.size >= file.size) return file;

    const ext = outType === "image/png" ? "png" : outType === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.${ext}`, { type: outType, lastModified: Date.now() });
  } catch {
    return file;
  }
}
