import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/auth/resend-verification
 * Resends the verification email to a user.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

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
              Welcome back to XYOMA. To complete your registration and begin your journey, please verify your email address.
            </p>
            <a href="${verificationUrl}" style="display: inline-block; background-color: #fff; color: #000; padding: 15px 35px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; transition: opacity 0.3s;">
              VERIFY EMAIL
            </a>
            <p style="font-size: 12px; font-weight: 300; margin-top: 50px; opacity: 0.5;">
              This link will expire in 24 hours. If you did not request this, please ignore this email.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend verification email sending failed:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification email resent successfully. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
