import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/en/sign-in",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.hashedPassword) return null;

        const valid = await bcrypt.compare(credentials.password as string, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Nodemailer({
      // No real SMTP server used - sendVerificationRequest below calls
      // the Resend API directly instead. This placeholder server config
      // is required by the provider's type signature but never used.
      server: { host: "unused", port: 587, auth: { user: "", pass: "" } },
      from: "AKSUM <onboarding@resend.dev>",
      async sendVerificationRequest({ identifier, url }) {
        try {
          await resend.emails.send({
            from: "AKSUM <onboarding@resend.dev>",
            to: identifier,
            subject: "Sign in to AKSUM",
            html: `
              <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                <h1 style="font-size: 22px;">Sign in to AKSUM</h1>
                <p style="color: #444;">Click the link below to sign in. This link expires shortly and can only be used once.</p>
                <a href="${url}" style="display: inline-block; background: #12100D; color: #F8F5EF; padding: 12px 24px; text-decoration: none; margin-top: 16px;">Sign in</a>
                <p style="color: #888; font-size: 13px; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
              </div>
            `,
          });
        } catch (error) {
          console.error("Resend send failed:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.role = dbUser?.role ?? "SUBSCRIBER"; token.membershipTier = dbUser?.membershipTier ?? "reader";
      }
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        token.role = dbUser?.role ?? "SUBSCRIBER"; token.membershipTier = dbUser?.membershipTier ?? "reader";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as any) ?? "SUBSCRIBER"; session.user.membershipTier = (token.membershipTier as string) ?? "reader";
      }
      return session;
    },
  },
});


