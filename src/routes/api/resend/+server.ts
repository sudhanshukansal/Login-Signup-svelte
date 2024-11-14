// src/routes/api/register/+server.js
import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid"; // UUID for OTP generation
import nodemailer from "nodemailer";
import { GMAIL_APP_PASSWORD, GMAIL_USER } from "$env/static/private";

// Mock database for storing OTP and user data (replace with a real DB)
let pendingVerifications = {};
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // use your email service
  auth: {
    user: GMAIL_USER, // your email
    pass: GMAIL_APP_PASSWORD, // your email password
  },
});

export async function POST({ request }) {
    const { pendingVerifications } = await request.json();
  
    // const userData = await pendingVerifications.data;

  // Validate form data
    console.log(pendingVerifications,"resend")

  // Generate OTP
  const otp = uuidv4().replace(/\D/g, "").slice(0, 4); 
  pendingVerifications.otp = otp

  // Send OTP via email
  await transporter.sendMail({
    from: GMAIL_USER,
    to: pendingVerifications?.data.gmail,
    subject: "Your Registration OTP",
    text: `Your OTP is ${otp}`,
  });

  return json({ message: "OTP sent to email", pendingVerifications , });
}
