const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: env.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed =
      /image\/(jpeg|jpg|png|webp|gif)|video\/(mp4|webm)|application\/pdf/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image or video uploads are allowed."));
    }
  }
});

module.exports = { upload, uploadsDir };
