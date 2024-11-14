// src/routes/api/register/+server.js
import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid"; // UUID for OTP generation
import nodemailer from "nodemailer";
import { GMAIL_APP_PASSWORD, GMAIL_USER } from "$env/static/private";
import { connectToDatabase } from "$lib/db";
import bcrypt from "bcrypt";

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
  const { name, surname, businessname, gmail, contactnumber, password } =
    await request.json();

  const db = await connectToDatabase();
  const userDatabase = db?.db("user");
  const userCollection = userDatabase?.collection("users");

  const existingUser = await userCollection.findOne({ gmail });

  if (existingUser) {
    return json({ success: false, message: "User already exist" });
  }
  // Validate form data
  if (
    !name ||
    !surname ||
    !businessname ||
    !gmail ||
    !contactnumber ||
    !password
  ) {
    return json({ message: "All fields are required" }, { status: 400 });
  }

  // Generate OTP
  const otp = uuidv4().replace(/\D/g, "").slice(0, 4); // Shortened UUID as OTP
  const hashedPassword = await bcrypt.hash(password, 16);
  pendingVerifications = {
    otp,
    data: {
      name,
      surname,
      businessname,
      gmail,
      contactnumber,
      password: hashedPassword,
    },
  };

  //   console.log(pendingVerifications,"gsiter")
  // Send OTP via email
  await transporter.sendMail({
    from: GMAIL_USER,
    to: gmail,
    subject: "Your Registration OTP",
    text: `Your OTP is ${otp}`,
  });

  return json({
    success: true,
    message: "OTP sent to email",
    pendingVerifications,
  });
}
