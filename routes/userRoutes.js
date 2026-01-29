import express from "express";

import {
  registerUser,
  loginUser,
  getSavedProfiles,
} from "../controllers/userController.js";

import { toggleSaveProfile } from "../controllers/userSaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* AUTH */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* SAVED SYSTEM */
router.post("/save/:profileId", protect, toggleSaveProfile);
router.get("/saved", protect, getSavedProfiles);

export default router;