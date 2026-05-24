const ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin"
};

const SUPER_ADMIN_USERNAME = "nadeesha24";

function isSuperAdminUsername(username) {
  return String(username || "").trim().toLowerCase() === SUPER_ADMIN_USERNAME;
}

function isSuperAdminRole(role) {
  return role === ROLES.SUPER_ADMIN;
}

module.exports = {
  ROLES,
  SUPER_ADMIN_USERNAME,
  isSuperAdminUsername,
  isSuperAdminRole
};
