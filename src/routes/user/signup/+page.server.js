import { connectToDatabase } from "$lib/db";
import { sendOtp } from "$lib/sendotp";

/** @type {import('./$types').Actions} */
export const actions = {
  register: async ({ request }) => {
    const formData = await request.formData();

    // Retrieve and validate the form data
    const name = formData.get("fName");
    const surname = formData.get("lName");
    const businessname = formData.get("bName");
    const email = formData.get("email");
    const contactnumber = formData.get("cntNumber");
    const password = formData.get("password");
    const isGmailVerified = false;

    // Connect to the database
    const db = await connectToDatabase();
    const userDatabase = db?.db("user");
    const userCollection = userDatabase?.collection("users");

    if (!userCollection) {
      return { error: "Database connection failed." };
    }

    // Check if the user with the same email already exists
    const existingUser = await userCollection.findOne({ email });
    console.log(existingUser, "exit user")
    if (existingUser) {
      // If the existing user is already verified, return an error
      if (existingUser.isGmailVerified) {
        return {
          success: false,
          error: "Email already exists and is verified.",
        };
      } else {
        // If the email exists but is not verified, proceed to send an OTP for verification
        // Add your OTP logic here
        try {
          const test = await sendOtp(email);
          console.log(test);
          return {
            success: true,
            error: "otp has been send",
            data: {
              name,
              surname,
              businessname,
              contactnumber,
              email,
              isGmailVerified,
            },
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to send OTP. Please try again.",
          };
        }
      }
    }

    await userCollection.insertOne({
      name,
      surname,
      businessname,
      contactnumber,
      email,
      password,
      isGmailVerified,
    });

    try {
      const test = await sendOtp(email);
      console.log(test);
      return {
        success: true,
        message: "User registered successfully.",
        error: "otp has been send",
        data: {
          name,
          surname,
          businessname,
          contactnumber,
          email,
          isGmailVerified,
        },
      };
    } catch (error) {
      return { success: false, error: "Failed to send OTP. Please try again." };
    }

    // Insert the new user with isGmailVerified set to false
  },
  
};
