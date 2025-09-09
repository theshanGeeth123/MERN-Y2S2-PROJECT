
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


transporter.verify()
  .then(() => console.log("✅ SMTP transporter is ready"))
  .catch(err => console.error("❌ SMTP verify failed:", err?.message || err));

export default transporter;
