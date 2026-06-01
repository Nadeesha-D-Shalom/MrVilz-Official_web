require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });

function parseMongoDbName(uri) {
  if (process.env.MONGODB_DB_NAME) return process.env.MONGODB_DB_NAME;
  if (!uri) return "mrvilz";
  try {
    const pathname = new URL(uri).pathname.replace(/^\//, "");
    return pathname || "mrvilz";
  } catch {
    return "mrvilz";
  }
}

const mongodbUri = process.env.MONGODB_URI || "";

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodb: {
    uri: mongodbUri,
    dbName: parseMongoDbName(mongodbUri)
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  },
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "MrVilz@Admin2026"
  },
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  publicSiteUrl:
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://www.mrvilz.com" : ""),
  uploadMaxMb: Number(process.env.UPLOAD_MAX_MB) || 10,
  /** Optional — used only by scripts/migrate-to-mongo.js */
  mysql: {
    host: process.env.DB_HOST || "",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mrvilzdb"
  }
};
