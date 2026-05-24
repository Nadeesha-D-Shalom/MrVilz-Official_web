const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const env = require("../config/env");
const { toAdminDto } = require("../utils/adminDto");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const admin = await Admin.findOne({ username }).lean();

    if (!admin || admin.is_active === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const id = String(admin._id);
    const token = jwt.sign({ id, username: admin.username }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn
    });

    return res.json({
      token,
      admin: toAdminDto(admin)
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const doc = await Admin.findById(req.admin.id).lean();
    if (!doc || doc.is_active === 0) {
      return res.status(401).json({ message: "Account inactive or not found." });
    }
    return res.json({ admin: toAdminDto(doc) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, me };
