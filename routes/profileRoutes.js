import express from "express";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import Profile from "../models/Profile.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   ✅ GET LOGGED-IN USER PROFILE
   GET /api/profiles/myprofile/me
===================================================== */
router.get("/myprofile/me", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        message: "No profile created yet",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("❌ Fetch MyProfile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ UPDATE LOGGED-IN USER PROFILE
   PUT /api/profiles/myprofile/me
===================================================== */
router.put("/myprofile/me", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({
        message: "No profile created yet",
      });
    }

    // Update fields
    profile.name = req.body.name || profile.name;
    profile.age = req.body.age || profile.age;
    profile.location = req.body.location || profile.location;
    profile.career = req.body.career || profile.career;
    profile.description = req.body.description || profile.description;

    // Tags conversion
    profile.tags = req.body.tags
      ? req.body.tags.split(",").map((t) => t.trim())
      : profile.tags;

    const updatedProfile = await profile.save();

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Update MyProfile Error:", error.message);
    res.status(500).json({ message: "Update failed" });
  }
});

/* =====================================================
   ✅ GET ALL PROFILES (PUBLIC)
   GET /api/profiles
===================================================== */
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
});

/* =====================================================
   ✅ CREATE PROFILE (LOGIN REQUIRED)
   POST /api/profiles
===================================================== */
router.post("/", protect, async (req, res) => {
  try {
    const profile = await Profile.create({
      ...req.body,

      tags: req.body.tags
        ? req.body.tags.split(",").map((t) => t.trim())
        : [],

      images: [],
      user: req.user._id,
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error("❌ Profile creation failed:", error.message);
    res.status(500).json({ message: "Profile creation failed" });
  }
});

/* =====================================================
   ✅ UPLOAD IMAGE (ONLY OWNER)
   POST /api/profiles/:id/upload
===================================================== */
router.post(
  "/:id/upload",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "roommate_profiles",
      });

      const profile = await Profile.findById(req.params.id);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // ✅ Only owner allowed
      if (profile.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      profile.images.unshift(result.secure_url);
      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error("❌ Image upload failed:", error.message);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);

/* =====================================================
   ✅ GET PROFILE BY ID (PUBLIC)
   GET /api/profiles/:id
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/* =====================================================
   ✅ UPDATE PROFILE BY ID (ONLY OWNER)
   PUT /api/profiles/:id
===================================================== */
router.put("/:id", protect, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ Only owner can update
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    profile.name = req.body.name || profile.name;
    profile.age = req.body.age || profile.age;
    profile.location = req.body.location || profile.location;
    profile.career = req.body.career || profile.career;
    profile.description = req.body.description || profile.description;

    profile.tags = req.body.tags
      ? req.body.tags.split(",").map((t) => t.trim())
      : profile.tags;

    const updated = await profile.save();

    res.json(updated);
  } catch (error) {
    console.error("❌ Profile update failed:", error.message);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;