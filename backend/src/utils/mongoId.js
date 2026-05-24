const { mongoose } = require("../config/db");

function isValidId(id) {
  return Boolean(id && mongoose.Types.ObjectId.isValid(String(id)));
}

function toObjectId(id) {
  if (!isValidId(id)) return null;
  return new mongoose.Types.ObjectId(String(id));
}

module.exports = { isValidId, toObjectId };
