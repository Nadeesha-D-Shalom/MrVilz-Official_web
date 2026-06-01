const env = require("../config/env");

/** Public origin for absolute image URLs (SEO, split frontend/API deploys). */
function getPublicBaseUrl() {
  const fromEnv =
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.API_PUBLIC_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (env.nodeEnv === "production") return "https://www.mrvilz.com";
  return env.clientOrigin.replace(/\/$/, "");
}

function resolveMediaUrl(path) {
  if (!path || typeof path !== "string") return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = getPublicBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

module.exports = { getPublicBaseUrl, resolveMediaUrl };
