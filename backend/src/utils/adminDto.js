const { resolveAdminRole } = require("./adminRoles");

function toAdminDto(doc) {
  if (!doc) return null;
  const row = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(row._id),
    username: row.username,
    name: row.display_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    role: resolveAdminRole(row),
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

module.exports = { toAdminDto };
