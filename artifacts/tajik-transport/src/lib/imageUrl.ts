export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

/** Convert a freshly-uploaded objectPath (e.g. /objects/uploads/uuid) into the
 * served URL that should be persisted in the DB. */
export function objectPathToServedUrl(objectPath: string): string {
  if (objectPath.startsWith("/objects/")) return `/api/storage${objectPath}`;
  return objectPath;
}
