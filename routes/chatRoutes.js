import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   🔔 NOTIFICATIONS FIRST
================================ */
router.get("/notifications", protect, async (req, res) => {
  try {
    const myId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiver: myId,
      isRead: false,
    });

    const unreadMessages = await Message.find({
      receiver: myId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sender", "name");

    res.json({
      unreadCount,
      messages: unreadMessages.map((msg) => ({
        _id: msg._id,
        senderId: msg.sender?._id,
        senderName: msg.sender?.name || "Unknown",
        text: msg.text,
      })),
    });
  } catch (error) {
    console.error("❌ Notifications Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

/* ================================
   ✅ LOAD CHAT WITH USER
================================ */
router.get("/:id", protect, async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: otherUserId, receiver: myId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error("❌ Load Chat Error:", error.message);
    res.status(500).json({ message: "Failed to load chat" });
  }
});

/* ================================
   ✅ SEND MESSAGE
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Message data missing" });
    }

    const newMsg = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    res.status(201).json(newMsg);
  } catch (error) {
    console.error("❌ Send Message Error:", error.message);
    res.status(500).json({ message: "Message sending failed" });
  }
});

export default router;