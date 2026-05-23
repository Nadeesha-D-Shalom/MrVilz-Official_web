const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");

const applicationsDir = path.join(__dirname, "..", "..", "uploads", "applications");

if (!fs.existsSync(applicationsDir)) {
  fs.mkdirSync(applicationsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, applicationsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const allowedMime =
  /application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document/i;

const applicationUpload = multer({
  storage,
  limits: { fileSize: env.uploadMaxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMime.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("CV must be PDF, DOC, or DOCX."));
    }
  }
});

module.exports = { applicationUpload, applicationsDir };
