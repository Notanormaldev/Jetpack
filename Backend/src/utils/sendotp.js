import { sendEmail } from "../services/mailer.service.js"; 
import crypto from "crypto";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function sendOtpEmail(toEmail, otp) {
  await sendEmail({
    to: toEmail,
    subject: "Your Verification OTP - Jetpack",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Jetpack — Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 8px; color: #0071E3;">${otp}</h1>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: gray; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
    text: `Your Jetpack verification OTP is: ${otp}. Valid for 10 minutes.`,
  });
}