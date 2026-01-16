import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../../config.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

export default transporter;
