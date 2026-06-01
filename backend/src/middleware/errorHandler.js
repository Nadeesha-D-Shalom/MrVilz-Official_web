function errorHandler(err, _req, res, _next) {
  let status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  let message = err.message || "Internal server error.";

  if (err.code === 11000 || err.code === "11000") {
    status = 409;
    if (String(err.message).includes("slug")) {
      message = "A gallery section with this title already exists. Use a different title.";
    } else {
      message = "This record already exists.";
    }
  }

  return res.status(status).json({ message });
}

module.exports = { errorHandler };
