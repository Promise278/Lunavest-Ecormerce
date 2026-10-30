const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Users } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "admin@lunavest.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (name.length < 4 || password.length < 5) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be at least 4 characters and Password at least 5 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await Users.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: ADMIN_EMAILS.includes(normalizedEmail) ? "admin" : "user",
    };

    await Users.create(newUser);

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await Users.findOne({
      where: { email: email.trim().toLowerCase() },
      attributes: ["id", "name", "email", "password", "role"],
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      time: Date.now(),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    return res.status(200).json({
      success: true,
      token,
      user: payload,
      message: "User Login successfully",
    });
  } catch (error) {
    console.error("Logining Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = { register, login, getMe };
