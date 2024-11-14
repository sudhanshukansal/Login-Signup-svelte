// src/routes/api/login/+server.js
import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/db.js';
import bcrypt from 'bcrypt';

export async function POST({ request ,locals }) {
  const { gmail, password } = await request.json();
  const db = await connectToDatabase();
  const userDatabase = db?.db("user");
  const userCollection = userDatabase?.collection("users");
  const user = await userCollection.findOne({ gmail});
  console.log(user,"login user")

  if (!user) {
    return json({ success: false, message: 'User does not exist' }, { status: 404 });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  // console.log(isPasswordCorrect, "paasword match or not")
   if(!isPasswordCorrect){
    return json({ success: false, message: 'password incorrect' }, { status: 404 });
   }
  // Verify password
  // const passwordMatch = await bcrypt.compare(password, user.password);
  // if (!passwordMatch) {
  //   return json({ success: false, message: 'Incorrect password' }, { status: 401 });
  // }
  locals.user = {email: user.gmail }; // Add user to session

  return json({ success: true, message: 'Login successful' });
}
