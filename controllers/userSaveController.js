import User from "../models/User.js";

export const toggleSaveProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if already saved
    const alreadySaved = user.savedProfiles
      .map((id) => id.toString())
      .includes(profileId);

    if (alreadySaved) {
      // ❌ Unsave
      user.savedProfiles = user.savedProfiles.filter(
        (id) => id.toString() !== profileId
      );
    } else {
      // ✅ Save
      user.savedProfiles.push(profileId);
    }

    await user.save();

    res.json({
      message: "Saved profiles updated",
      savedProfiles: user.savedProfiles,
    });
  } catch (error) {
    console.error("❌ Save Profile Error:", error.message);

    res.status(500).json({
      message: "Saving profile failed",
      error: error.message,
    });
  }
};