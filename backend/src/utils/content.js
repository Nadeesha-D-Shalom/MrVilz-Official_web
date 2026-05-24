const { SiteContent } = require("../models");

async function getContentByKey(key) {
  const row = await SiteContent.findOne({ content_key: key }).lean();
  if (!row) return null;
  const json = row.content_json;
  return typeof json === "string" ? JSON.parse(json) : json;
}

async function upsertContent(key, value) {
  await SiteContent.findOneAndUpdate(
    { content_key: key },
    { content_json: value },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

module.exports = { getContentByKey, upsertContent };
