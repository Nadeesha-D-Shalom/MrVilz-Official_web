const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { Admin } = require("../models");
const { isSuperAdminRole } = require("../utils/adminRoles");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.admin = jwt.verify(token, env.jwt.secret);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

async function loadAdminRole(req, res, next) {
  try {
    const doc = await Admin.findById(req.admin.id).select("role is_active username").lean();
    if (!doc || doc.is_active === 0) {
      return res.status(401).json({ message: "Account inactive or not found." });
    }
    req.admin.role = doc.role || "admin";
    req.admin.username = doc.username;
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireSuperAdmin(req, res, next) {
  if (!isSuperAdminRole(req.admin.role)) {
    return res.status(403).json({ message: "Super admin access required." });
  }
  return next();
}

module.exports = { authRequired, loadAdminRole, requireSuperAdmin };
