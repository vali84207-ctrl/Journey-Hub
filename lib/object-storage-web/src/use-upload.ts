import { useState, useCallback } from "react";
import type { UppyFile } from "@uppy/core";

type TokenGetter = () => string | null | undefined;
let tokenGetter: TokenGetter | null = null;

/** Register a function that returns the current auth token (e.g. admin JWT).
 * When set, upload requests will be called with `Authorization: Bearer <token>`. */
export function setUploadAuthTokenGetter(getter: TokenGetter): void {
  tokenGetter = getter;
}

function authHeaders(): Record<string, string> {
  const token = tokenGetter?.();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface UploadResponse {
  objectPath: string;
}

interface UseUploadOptions {
  /** Base path where object storage routes are mounted (default: "/api/storage") */
  basePath?: string;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * React hook for direct binary file uploads.
 *
 * Sends the file bytes directly to POST /api/storage/uploads with the
 * Content-Type header set to the image mime type. The server writes the
 * file to GCS (production) or local disk (dev fallback) and returns
 * { objectPath } which can be used to construct the serving URL.
 */
export function useUpload(options: UseUploadOptions = {}) {
  const basePath = options.basePath ?? "/api/storage";
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResponse | null> => {
      setIsUploading(true);
      setError(null);
      setProgress(10);

      try {
        const response = await fetch(`${basePath}/uploads`, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            ...authHeaders(),
          },
          body: file,
        });

        setProgress(90);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            (errorData as { error?: string }).error || "Upload failed"
          );
        }

        const result = (await response.json()) as UploadResponse;
        setProgress(100);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const uploadError =
          err instanceof Error ? err : new Error("Upload failed");
        console.error("[useUpload] Upload error:", uploadError.message);
        setError(uploadError);
        options.onError?.(uploadError);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [basePath, options]
  );

  const getUploadParameters = useCallback(
    async (
      file: UppyFile<Record<string, unknown>, Record<string, unknown>>
    ): Promise<{
      method: "PUT";
      url: string;
      headers?: Record<string, string>;
    }> => {
      const response = await fetch(`${basePath}/uploads/request-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const data = await response.json();
      return {
        method: "PUT",
        url: data.uploadURL,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      };
    },
    [basePath]
  );

  return {
    uploadFile,
    getUploadParameters,
    isUploading,
    error,
    progress,
  };
}
