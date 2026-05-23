require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mrvilzdb"
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
  uploadMaxMb: Number(process.env.UPLOAD_MAX_MB) || 10
};
