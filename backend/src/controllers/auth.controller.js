const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { queryOne } = require("../config/db");
const env = require("../config/env");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await queryOne(
      `SELECT id, username, password_hash, display_name, email, phone, address, is_active
       FROM admins WHERE username = :username LIMIT 1`,
      { username }
    );

    if (!admin || admin.is_active === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        displayName: admin.display_name,
        name: admin.display_name,
        email: admin.email,
        phone: admin.phone,
        address: admin.address
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.json({ admin: req.admin });
}

module.exports = { login, me };
