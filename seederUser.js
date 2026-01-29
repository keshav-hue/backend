import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

await User.deleteMany();

await User.create({
  name: "Test User",
  email: "test@test.com",
  password: "123456",
});

console.log("User seeded");
process.exit();