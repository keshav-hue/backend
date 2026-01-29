import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Profile from "./models/Profile.js";
import profiles from "./data/profiles.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Profile.deleteMany();
    await Profile.insertMany(profiles);
    console.log("Data seeded");
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seed();