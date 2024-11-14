// otp.js
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { GMAIL_APP_PASSWORD, GMAIL_USER } from '$env/static/private';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: GMAIL_USER,
		pass: GMAIL_APP_PASSWORD
	}
});

export async function sendOtp(email) {
	 const otp = uuidv4().replace(/\D/g, '').slice(0, 4);

	const mailOptions = {
		from: GMAIL_USER,
		to: email,
		subject: 'Your OTP for Verification',
		text: `Your OTP is: ${otp}`
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log(`OTP sent to ${email}: ${otp}`);
		return otp; // Return OTP to store temporarily for verification
	} catch (error) {
		console.error('Error sending OTP email:', error);
		throw new Error('OTP could not be sent');
	}
}
