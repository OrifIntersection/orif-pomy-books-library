import nodemailer from "nodemailer";

let transporter;

export default function Transporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  return transporter;
}
