const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const publicRoutes = require("./routes/public.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const galleryController = require("./controllers/gallery.controller");
const { uploadsDir } = require("./middleware/upload");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const frontendDistPath = path.join(__dirname, "..", "..", "frontend", "dist");
const hasFrontendBuild = fs.existsSync(frontendDistPath);

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(uploadsDir, { maxAge: env.nodeEnv === "production" ? "7d" : 0 }));

app.get("/api/health", (_req, res) => {
  res.json({ message: "MrVilz API is running.", env: env.nodeEnv });
});

app.get("/sitemap-images.xml", galleryController.getImageSitemap);

app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(errorHandler);

module.exports = app;
