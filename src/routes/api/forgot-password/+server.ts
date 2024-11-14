// src/routes/api/register/+server.js
import { json } from "@sveltejs/kit";
import { v4 as uuidv4 } from "uuid"; // UUID for OTP generation
import nodemailer from "nodemailer";
import { GMAIL_APP_PASSWORD, GMAIL_USER } from "$env/static/private";
import { connectToDatabase } from "$lib/db.js";
import bcrypt from "bcrypt";

let updatedPasword = {}

const transporter = nodemailer.createTransport({
  service: "gmail", // use your email service
  auth: {
    user: GMAIL_USER, // your email
    pass: GMAIL_APP_PASSWORD, // your email password
  },
});

export async function POST({ request }) {
  const { gmail , password } = await request.json();

  const db = await connectToDatabase();
  const userDatabase = db?.db("user");
  const userCollection = userDatabase?.collection("users");
  // console.log(userCollection,"user collection")
  if (userCollection) {
    const user = await userCollection.findOne({ gmail });
    // console.log(gmail, "gmail");
    // console.log(user, "check existing user or not");
    if (user) {
      const otp = uuidv4().replace(/\D/g, "").slice(0, 4);
    //   const hashedPassword = await bcrypt.hash(password, 16);

      updatedPasword={
        otp,
       data:{
        gmail,
        password
       }
       
      }
      await transporter.sendMail({
        from: GMAIL_USER,
        to: gmail,
        subject: "Your Registration OTP",
        text: `Your OTP is ${otp}`,
      });

      return json({
        success: true,
        message: "OTP sent to email",
        updatedPasword

      });
    }
  }

  // Validate form data

  return json({ success: false, message: "User doesnot exist" });
}
