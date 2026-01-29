import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Message from "../models/Message.js";

/* ✅ Get Admin Dashboard Stats */
export const getAdminStats = async (req, res) => {
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
    console.log("❌ Admin Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};