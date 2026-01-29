import Profile from "../models/Profile.js";

export const getProfiles = async (req, res) => {
  const profiles = await Profile.find().sort({ createdAt: -1 });
  res.json(profiles);
};

export const getProfileById = async (req, res) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json(profile);
};