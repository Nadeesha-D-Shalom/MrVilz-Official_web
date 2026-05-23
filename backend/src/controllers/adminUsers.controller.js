const bcrypt = require("bcrypt");
const { query, queryOne } = require("../config/db");

const PUBLIC_FIELDS =
  "id, username, display_name, email, phone, address, is_active, created_at, updated_at";

function toAdminDto(row) {
  if (!row) return null;
  return {
    id: row.id,
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
    const rows = await query(
      `SELECT ${PUBLIC_FIELDS} FROM admins ORDER BY created_at DESC`
    );
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

    const existingUser = await queryOne(
      "SELECT id FROM admins WHERE username = :username LIMIT 1",
      { username }
    );
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const existingEmail = await queryOne(
      "SELECT id FROM admins WHERE email = :email LIMIT 1",
      { email }
    );
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO admins (username, password_hash, display_name, email, phone, address, is_active)
       VALUES (:username, :password_hash, :display_name, :email, :phone, :address, 1)`,
      {
        username,
        password_hash: passwordHash,
        display_name: name,
        email,
        phone,
        address
      }
    );

    const created = await queryOne(`SELECT ${PUBLIC_FIELDS} FROM admins WHERE id = :id`, {
      id: result.insertId
    });
    return res.status(201).json({ admin: toAdminDto(created) });
  } catch (error) {
    return next(error);
  }
}

async function updateAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    const target = await queryOne(`SELECT ${PUBLIC_FIELDS} FROM admins WHERE id = :id`, { id });
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

    const usernameTaken = await queryOne(
      "SELECT id FROM admins WHERE username = :username AND id != :id LIMIT 1",
      { username, id }
    );
    if (usernameTaken) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const emailTaken = await queryOne(
      "SELECT id FROM admins WHERE email = :email AND id != :id LIMIT 1",
      { email, id }
    );
    if (emailTaken) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const isActive =
      req.body.isActive === undefined ? target.is_active : req.body.isActive ? 1 : 0;

    if (isActive === 0 && Number(req.admin.id) === id) {
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    }

    if (isActive === 0) {
      const activeCount = await queryOne(
        "SELECT COUNT(*) AS total FROM admins WHERE is_active = 1 AND id != :id",
        { id }
      );
      if (Number(activeCount.total) < 1) {
        return res.status(400).json({ message: "At least one active admin is required." });
      }
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    if (passwordHash) {
      await query(
        `UPDATE admins
         SET username = :username,
             display_name = :display_name,
             email = :email,
             phone = :phone,
             address = :address,
             is_active = :is_active,
             password_hash = :password_hash
         WHERE id = :id`,
        {
          id,
          username,
          display_name: name,
          email,
          phone,
          address,
          is_active: isActive,
          password_hash: passwordHash
        }
      );
    } else {
      await query(
        `UPDATE admins
         SET username = :username,
             display_name = :display_name,
             email = :email,
             phone = :phone,
             address = :address,
             is_active = :is_active
         WHERE id = :id`,
        {
          id,
          username,
          display_name: name,
          email,
          phone,
          address,
          is_active: isActive
        }
      );
    }

    const updated = await queryOne(`SELECT ${PUBLIC_FIELDS} FROM admins WHERE id = :id`, { id });
    return res.json({ admin: toAdminDto(updated) });
  } catch (error) {
    return next(error);
  }
}

async function deactivateAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number(req.admin.id) === id) {
      return res.status(400).json({ message: "You cannot deactivate your own account." });
    }

    const target = await queryOne("SELECT id, is_active FROM admins WHERE id = :id", { id });
    if (!target) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const activeCount = await queryOne(
      "SELECT COUNT(*) AS total FROM admins WHERE is_active = 1 AND id != :id",
      { id }
    );
    if (Number(activeCount.total) < 1) {
      return res.status(400).json({ message: "At least one active admin is required." });
    }

    await query("UPDATE admins SET is_active = 0 WHERE id = :id", { id });
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
