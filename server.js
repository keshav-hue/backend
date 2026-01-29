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

/* ✅ FIXED CORS (Production Ready) */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://keshav-hue-frontend-dcy9.vercel.app", // vercel frontend
    ],
    credentials: true,
  })
);

/* Middleware */
app.use(express.json());

/* Test Route */
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

/* Port */
const PORT = process.env.PORT || 8088;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
