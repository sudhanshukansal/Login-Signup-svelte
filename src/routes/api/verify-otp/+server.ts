// src/routes/api/verify-otp/+server.js
import { json } from "@sveltejs/kit";
import { connectToDatabase } from "$lib/db.js";
// Mock database for user data
let usersDatabase = []; // Replace with your actual database logic
let pendingVerifications = {};
export async function POST({ request }) {
  const { pendingVerifications, otp } = await request.json();

  // Check if OTP matches

  const pending = pendingVerifications;
  const { name, surname, businessname, gmail, contactnumber, password } =
    await pendingVerifications.data;
  if (pending && pending.otp === otp) {
    // Insert data into database (mocked here)
    const db = await connectToDatabase();
    const userDatabase = db?.db("user");
    const userCollection = userDatabase?.collection("users");

    if (!userCollection) {
      return { error: "Database connection failed." };
    }

    // Check if the user with the same email already exists

    await userCollection.insertOne({
        name, surname, businessname, gmail, contactnumber, password
    });

    // Clean up verification entry

    return json({ message: "OTP verified and user registered" });
  }

  return json({ message: "Invalid OTP" }, { status: 400 });
}
