const bcrypt = require("bcrypt");
const { Admin } = require("../models");
const { isValidId, toObjectId } = require("../utils/mongoId");

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
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
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

    const { errors, name, username, email, phone, address, password } = validateAdminPayload(
      req.body,
      { requirePassword: false }
    );
    if (errors.length) {
      return res.status(400).json({ message: errors.join(" ") });
    }

    const usernameTaken = await Admin.findOne({ username, _id: { $ne: oid } });
    if (usernameTaken) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const emailTaken = await Admin.findOne({ email, _id: { $ne: oid } });
    if (emailTaken) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const isActive =
      req.body.isActive === undefined ? target.is_active : req.body.isActive ? 1 : 0;

    if (isActive === 0 && String(req.admin.id) === String(oid)) {
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    }

    if (isActive === 0) {
      const activeCount = await Admin.countDocuments({ is_active: 1, _id: { $ne: oid } });
      if (activeCount < 1) {
        return res.status(400).json({ message: "At least one active admin is required." });
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

    const activeCount = await Admin.countDocuments({ is_active: 1, _id: { $ne: oid } });
    if (activeCount < 1) {
      return res.status(400).json({ message: "At least one active admin is required." });
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
