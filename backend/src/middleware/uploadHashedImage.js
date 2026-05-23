const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const env = require("../config/env");

const uploadsRoot = path.join(__dirname, "..", "..", "uploads");

function buildHashedFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) ? ext : ".jpg";
  const hash = crypto
    .createHash("sha256")
    .update(`${Date.now()}-${originalName}-${crypto.randomBytes(16).toString("hex")}`)
    .digest("hex")
    .slice(0, 40);
  return { storedName: `${hash}${safeExt}`, fileHash: hash };
}

function createHashedImageUpload(folderName, { maxFiles = 30 } = {}) {
  const dir = path.join(uploadsRoot, folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const { storedName } = buildHashedFilename(file.originalname);
      cb(null, storedName);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: env.uploadMaxMb * 1024 * 1024, files: maxFiles },
    fileFilter: (_req, file, cb) => {
      if (/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files (JPG, PNG, WebP, GIF) are allowed."));
      }
    }
  });

  const urlPrefix = `/uploads/${folderName}/`;

  function publicUrlForStoredFile(filename) {
    return `${urlPrefix}${filename}`;
  }

  function resolveLocalPath(imageUrl) {
    if (!imageUrl || typeof imageUrl !== "string") return null;
    if (!imageUrl.startsWith(urlPrefix)) return null;
    return path.join(dir, path.basename(imageUrl));
  }

  function fileHashFromFilename(filename) {
    return path.basename(filename, path.extname(filename));
  }

  function deleteLocalFileIfExists(imageUrl) {
    const local = resolveLocalPath(imageUrl);
    if (local && fs.existsSync(local)) {
      fs.unlinkSync(local);
    }
  }

  return {
    upload,
    dir,
    urlPrefix,
    publicUrlForStoredFile,
    resolveLocalPath,
    fileHashFromFilename,
    deleteLocalFileIfExists
  };
}

const galleryImage = createHashedImageUpload("gallery");
const projectImage = createHashedImageUpload("projects");
const teamImage = createHashedImageUpload("team");

module.exports = {
  createHashedImageUpload,
  galleryImage,
  projectImage,
  teamImage
};
