import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/* ============================
   ✅ SEND CONTACT EMAIL
============================ */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Email Options
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${name}`,
      text: `
You received a new message:

Name: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    // Send Mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

export default router;