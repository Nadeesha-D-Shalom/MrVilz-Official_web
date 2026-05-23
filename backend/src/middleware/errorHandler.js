function errorHandler(err, _req, res, _next) {
  const status = err.status || (err.code === "LIMIT_FILE_SIZE" ? 413 : 500);
  const message = err.message || "Internal server error.";
  return res.status(status).json({ message });
}

module.exports = { errorHandler };
