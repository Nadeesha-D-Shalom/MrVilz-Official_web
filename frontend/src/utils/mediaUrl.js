/** Resolve relative upload/static paths for display (fallback when API returns relative URLs). */
export function resolveMediaUrl(path) {
  if (!path || typeof path !== "string") return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || "";
  if (base) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base.replace(/\/$/, "")}${normalized}`;
  }
  return path;
}
