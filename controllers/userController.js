import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ✅ Generate JWT */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ============================
   ✅ REGISTER USER
============================ */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. User exists?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      savedProfiles: [], // ✅ Important
    });

    // 5. Return token + user
    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* ============================
   ✅ LOGIN USER
============================ */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Return token + user
    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

/* ============================
   ✅ GET SAVED PROFILES
============================ */
export const getSavedProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedProfiles");

    res.json(user.savedProfiles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved profiles",
      error: error.message,
    });
  }
};