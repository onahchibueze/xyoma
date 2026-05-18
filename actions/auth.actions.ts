'use server';

import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

export async function registerUser(userData: Partial<IUser>) {
  try {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      return { error: "Please fill all fields" };
    }

    await dbConnect();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return { error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    // Construct verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: "Verify your XYOMA account",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center; max-width: 600px; margin: auto;">
            <h1 style="font-weight: 200; letter-spacing: 5px; margin-bottom: 30px;">XYOMA</h1>
            <p style="font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 40px;">
              Welcome to the future of luxury. To complete your registration and begin your journey with XYOMA, please verify your email address.
            </p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #fff; color: #000; padding: 15px 35px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; transition: opacity 0.3s;">
              VERIFY EMAIL
            </a>
            <p style="font-size: 12px; font-weight: 300; margin-top: 50px; opacity: 0.5;">
              This link will expire in 24 hours. If you did not create an account, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Verification email sending failed:", emailError);
      // We don't return error here because the user is already created
    }

    return { success: "Registration successful. Please check your email to verify your account.", userId: user._id.toString() };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return { error: error instanceof Error ? error.message : "An error occurred during registration" };
  }
}
