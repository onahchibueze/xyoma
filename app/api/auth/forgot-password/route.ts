import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/auth/forgot-password
 * Handles password reset requests by generating a token and sending an email.
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

    // Security: Always return success message even if user doesn't exist to prevent email enumeration
    const successResponse = NextResponse.json(
      { message: "If an account exists with that email, a password reset link has been sent." },
      { status: 200 }
    );

    if (!user) {
      return successResponse;
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Save token and expiry to user model
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // Construct reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: "Reset your XYOMA password",
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 40px; text-align: center; max-width: 600px; margin: auto;">
            <h1 style="font-weight: 200; letter-spacing: 5px; margin-bottom: 30px;">XYOMA</h1>
            <p style="font-size: 16px; font-weight: 300; line-height: 1.6; margin-bottom: 40px;">
              We received a request to reset your password. If you did not make this request, you can safely ignore this email.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #fff; color: #000; padding: 15px 35px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 2px; transition: opacity 0.3s;">
              RESET PASSWORD
            </a>
            <p style="font-size: 12px; font-weight: 300; margin-top: 50px; opacity: 0.5;">
              This link will expire in 1 hour.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Reset email sending failed:", emailError);
      // We still return success to the user for security
    }

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
