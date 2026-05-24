export function isSuperAdmin(admin) {
  return admin?.role === "super_admin";
}

export const ROLE_LABELS = {
  admin: "Admin",
  super_admin: "Super admin"
};
