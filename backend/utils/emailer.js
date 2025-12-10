import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = null;

const initTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
};

export const sendEmailReply = async ({ to, subject, text }) => {
  const t = initTransporter();
  if (!t) {
    return;
  }
  try {
    await t.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};