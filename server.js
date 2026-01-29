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

app.use(cors());
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

/* ENV PORT */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);