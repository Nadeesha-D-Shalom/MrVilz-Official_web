const SUPER_ADMIN_USERNAMES = ["nadeesha24", "admin"];

export function effectiveRole(admin) {
  if (!admin) return "admin";
  const username = String(admin.username || "").trim().toLowerCase();
  if (admin.role === "super_admin" || SUPER_ADMIN_USERNAMES.includes(username)) {
    return "super_admin";
  }
  return admin.role || "admin";
}

export function isSuperAdmin(admin) {
  return effectiveRole(admin) === "super_admin";
}

export const ROLE_LABELS = {
  admin: "Admin",
  super_admin: "Super admin"
};

export function roleLabel(admin) {
  return ROLE_LABELS[effectiveRole(admin)] || "Admin";
}
