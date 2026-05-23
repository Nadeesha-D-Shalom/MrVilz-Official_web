const { galleryImage } = require("./uploadHashedImage");

module.exports = {
  galleryUpload: galleryImage.upload,
  galleryDir: galleryImage.dir,
  publicUrlForStoredFile: galleryImage.publicUrlForStoredFile,
  resolveLocalPath: galleryImage.resolveLocalPath,
  fileHashFromFilename: galleryImage.fileHashFromFilename,
  deleteLocalFileIfExists: galleryImage.deleteLocalFileIfExists
};
