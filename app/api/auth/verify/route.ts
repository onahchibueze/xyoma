import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Invalid+token", req.url));
    }

    await dbConnect();

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=Token+invalid+or+expired", req.url)
      );
    }

    // Update user to verified status and clear token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // Redirect to login page with success message
    return NextResponse.redirect(
      new URL("/login?success=Email+verified+successfully.+You+can+now+login.", req.url)
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL("/login?error=An+error+occurred+during+verification", req.url)
    );
  }
}
