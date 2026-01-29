import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();
connectDB();

const app = express();

/* Middleware */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://keshav-hue-frontend-dcy9.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

/* Test */
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});
