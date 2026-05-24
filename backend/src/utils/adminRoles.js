const env = require("../config/env");

const ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin"
};

const SUPER_ADMIN_USERNAMES = new Set(
  ["nadeesha24", String(env.admin.username || "admin").trim().toLowerCase()].filter(Boolean)
);

function isSuperAdminUsername(username) {
  return SUPER_ADMIN_USERNAMES.has(String(username || "").trim().toLowerCase());
}

function isSuperAdminRole(role) {
  return role === ROLES.SUPER_ADMIN;
}

function resolveAdminRole(doc) {
  if (!doc) return ROLES.ADMIN;
  const username = String(doc.username || "").trim().toLowerCase();
  if (SUPER_ADMIN_USERNAMES.has(username) || isSuperAdminRole(doc.role)) {
    return ROLES.SUPER_ADMIN;
  }
  return doc.role || ROLES.ADMIN;
}

module.exports = {
  ROLES,
  SUPER_ADMIN_USERNAMES,
  isSuperAdminUsername,
  isSuperAdminRole,
  resolveAdminRole
};
