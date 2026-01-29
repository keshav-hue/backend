import express from "express";

import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Message from "../models/Message.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ============================
   ✅ Admin Dashboard Stats
============================ */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalMessages = await Message.countDocuments();

    res.json({
      totalUsers,
      totalProfiles,
      totalMessages,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
});

/* ============================
   ✅ View All Users
============================ */
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/* ============================
   ✅ View All Profiles
============================ */
router.get("/profiles", protect, adminOnly, async (req, res) => {
  const profiles = await Profile.find().populate("user", "name email");
  res.json(profiles);
});

/* ============================
   ✅ View All Messages (Admin)
============================ */
router.get("/messages", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Cannot fetch messages" });
  }
});

/* ============================
   ✅ Delete Any Profile
============================ */
router.delete("/profile/:id", protect, adminOnly, async (req, res) => {
  await Profile.findByIdAndDelete(req.params.id);
  res.json({ message: "Profile deleted successfully" });
});

/* ============================
   ✅ Delete Any User
============================ */
router.delete("/user/:id", protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

export default router;