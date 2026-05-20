import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required");
        }

        await dbConnect();

        // Check if this is a token-based verification login
        if (credentials.token) {
          const user = await User.findOne({ 
            email: credentials.email,
            verificationToken: credentials.token,
            verificationTokenExpiry: { $gt: new Date() }
          });

          if (!user) {
            throw new Error("Invalid or expired verification link");
          }

          // Mark as verified and clear token
          user.isVerified = true;
          user.verificationToken = undefined;
          user.verificationTokenExpiry = undefined;
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        }

        if (!credentials.password) {
          throw new Error("Password is required");
        }

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email first");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // This is a new user signing up via Google
            // The adapter will also create the user, but we ensure it's synced with our model
            // and send a welcome email
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              isVerified: true,
              role: 'user',
            });
            
            // Send welcome email for new Google signup
            try {
              if (user.email && user.name) {
                await sendWelcomeEmail(user.email, user.name);
              }
            } catch (emailError) {
              console.error("Google welcome email failed:", emailError);
            }
          } else {
            // User exists, just update their profile info from Google
            await User.findOneAndUpdate(
              { email: user.email },
              { 
                $set: { 
                  isVerified: true,
                  name: user.name,
                  image: user.image 
                }
              }
            );
          }
        } catch (error) {
          console.error("Error syncing Google user to database:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // If user is already on admin page or going there, allow it
      if (url.includes('/admin')) return url.startsWith(baseUrl) ? url : `${baseUrl}${url}`;
      
      // Default behavior
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
