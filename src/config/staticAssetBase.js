import API_BASE_URL from "./api.js";

/**
 * API base URL sometimes includes `/api` or `/api/v1`; uploaded files are served at the site root `/uploads/...`.
 */
export function getBackendOriginForStaticFiles() {
  let base = (API_BASE_URL || "").trim().replace(/\/$/, "");
  base = base.replace(/\/api\/v1$/i, "").replace(/\/api$/i, "");
  if (base) return base;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/**
 * Absolute URL for backend paths like `/uploads/shop/x.jpg`.
 * In Vite dev, returns a root-relative path so `server.proxy` can forward `/uploads` to the API.
 */
export function absoluteUrlForUploadPath(path) {
  if (path == null) return null;
  const s = typeof path === "string" ? path.trim() : String(path).trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  const p = s.startsWith("/") ? s : `/${s}`;
  if (import.meta.env.DEV) return p;
  const origin = getBackendOriginForStaticFiles().replace(/\/$/, "");
  if (!origin) return p;
  return `${origin}${p}`;
}
