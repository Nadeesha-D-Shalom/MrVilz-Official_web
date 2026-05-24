const bcrypt = require("bcrypt");
const { Admin } = require("../models");
const { isValidId, toObjectId } = require("../utils/mongoId");
const { toAdminDto } = require("../utils/adminDto");
const { ROLES, isSuperAdminRole } = require("../utils/adminRoles");

function resolveRoleForCreate(body, callerRole) {
  const requested = body.role;
  if (requested === ROLES.SUPER_ADMIN) {
    if (!isSuperAdminRole(callerRole)) {
      return { error: "Only super admins can create super admin accounts." };
    }
    return { role: ROLES.SUPER_ADMIN };
  }
  return { role: ROLES.ADMIN };
}

function validateAdminPayload(body, { requirePassword }) {
  const errors = [];
  const name = (body.name || body.displayName || "").trim();
  const username = (body.username || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const address = (body.address || "").trim();
  const password = body.password || "";

  if (!name) errors.push("Name is required.");
  if (!username || username.length < 3) errors.push("Username must be at least 3 characters.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email is required.");
  if (!phone) errors.push("Phone number is required.");
  if (!address) errors.push("Address is required.");
  if (requirePassword && (!password || password.length < 8)) {
    errors.push("Password must be at least 8 characters.");
  }
  if (!requirePassword && password && password.length < 8) {
    errors.push("New password must be at least 8 characters.");
  }

  return { errors, name, username, email, phone, address, password };
}

async function listAdmins(_req, res, next) {
  try {
    const rows = await Admin.find().sort({ created_at: -1 });
    return res.json({ admins: rows.map(toAdminDto) });
  } catch (error) {
    return next(error);
  }
}

async function createAdmin(req, res, next) {
  try {
    const { errors, name, username, email, phone, address, password } = validateAdminPayload(
      req.body,
      { requirePassword: true }
    );
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const roleResult = resolveRoleForCreate(req.body, req.admin.role);
    if (roleResult.error) {
      return res.status(403).json({ message: roleResult.error });
    }

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await Admin.create({
      username,
      password_hash: passwordHash,
      display_name: name,
      email,
      phone,
      address,
      role: roleResult.role,
      is_active: 1
    });

    return res.status(201).json({ admin: toAdminDto(created) });
  } catch (error) {
    return next(error);
  }
}

async function updateAdmin(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const target = await Admin.findById(oid);
    if (!target) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const callerIsSuper = isSuperAdminRole(req.admin.role);
    const isSelf = String(req.admin.id) === String(oid);

    if (!callerIsSuper && !isSelf) {
      return res.status(403).json({ message: "You can only edit your own profile." });
    }

    if (!callerIsSuper && isSuperAdminRole(target.role)) {
      return res.status(403).json({ message: "Only super admins can edit super admin accounts." });
    }

    const { errors, name, username, email, phone, address, password } = validateAdminPayload(
      req.body,
      { requirePassword: false }
    );
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    if (req.body.role !== undefined) {
      if (!callerIsSuper) {
        return res.status(403).json({ message: "Only super admins can change roles." });
      }
      if (isSelf && req.body.role !== ROLES.SUPER_ADMIN && isSuperAdminRole(target.role)) {
        const superCount = await Admin.countDocuments({
          role: ROLES.SUPER_ADMIN,
          is_active: 1,
          _id: { $ne: oid }
        });
        if (superCount < 1) {
          return res.status(400).json({ message: "At least one active super admin is required." });
        }
      }
      const nextRole = req.body.role;
      if (nextRole !== ROLES.ADMIN && nextRole !== ROLES.SUPER_ADMIN) {
        return res.status(400).json({ message: "Invalid role." });
      }
      if (nextRole === ROLES.ADMIN && isSuperAdminRole(target.role)) {
        const superCount = await Admin.countDocuments({
          role: ROLES.SUPER_ADMIN,
          is_active: 1,
          _id: { $ne: oid }
        });
        if (superCount < 1) {
          return res.status(400).json({ message: "At least one active super admin is required." });
        }
      }
      target.role = nextRole;
    }

    const usernameTaken = await Admin.findOne({ username, _id: { $ne: oid } });
    if (usernameTaken) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const emailTaken = await Admin.findOne({ email, _id: { $ne: oid } });
    if (emailTaken) {
      return res.status(409).json({ message: "Email already in use." });
    }

    let isActive =
      req.body.isActive === undefined ? target.is_active : req.body.isActive ? 1 : 0;

    if (!callerIsSuper && isSelf) {
      isActive = target.is_active;
    }

    if (isActive === 0 && String(req.admin.id) === String(oid)) {
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    }

    if (isActive === 0) {
      const activeCount = await Admin.countDocuments({ is_active: 1, _id: { $ne: oid } });
      if (activeCount < 1) {
        return res.status(400).json({ message: "At least one active admin is required." });
      }
      if (isSuperAdminRole(target.role)) {
        const superCount = await Admin.countDocuments({
          role: ROLES.SUPER_ADMIN,
          is_active: 1,
          _id: { $ne: oid }
        });
        if (superCount < 1) {
          return res.status(400).json({ message: "At least one active super admin is required." });
        }
      }
    }

    target.username = username;
    target.display_name = name;
    target.email = email;
    target.phone = phone;
    target.address = address;
    target.is_active = isActive;

    if (password) {
      target.password_hash = await bcrypt.hash(password, 12);
    }

    await target.save();
    return res.json({ admin: toAdminDto(target) });
  } catch (error) {
    return next(error);
  }
}

async function deactivateAdmin(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (String(req.admin.id) === String(oid)) {
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    }

    const target = await Admin.findById(oid);
    if (!target) {
      return res.status(404).json({ message: "Admin not found." });
    }

    if (!isSuperAdminRole(req.admin.role) && isSuperAdminRole(target.role)) {
      return res.status(403).json({ message: "Only super admins can deactivate super admin accounts." });
    }

    const activeCount = await Admin.countDocuments({ is_active: 1, _id: { $ne: oid } });
    if (activeCount < 1) {
      return res.status(400).json({ message: "At least one active admin is required." });
    }

    if (isSuperAdminRole(target.role)) {
      const superCount = await Admin.countDocuments({
        role: ROLES.SUPER_ADMIN,
        is_active: 1,
        _id: { $ne: oid }
      });
      if (superCount < 1) {
        return res.status(400).json({ message: "At least one active super admin is required." });
      }
    }

    target.is_active = 0;
    await target.save();
    return res.json({ message: "Admin deactivated." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listAdmins,
  createAdmin,
  updateAdmin,
  deactivateAdmin
};
