"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { authLimiter, getClientIp } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/seo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(email: string) {
  const { success } = await authLimiter.limit(email);
  if (!success) return { error: "Too many requests. Please wait a few minutes." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Deliberately return success even if no account exists - prevents
  // leaking which emails are registered (a real, standard security practice).
  if (!user || !user.hashedPassword) return { success: true };

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: `password-reset:${email}`, token, expires },
  });

  const resetUrl = `${SITE_URL}/en/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    await resend.emails.send({
      from: "AKSUM <onboarding@resend.dev>",
      to: email,
      subject: "Reset your AKSUM password",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 22px;">Reset your password</h1>
          <p style="color: #444;">Click the link below to set a new password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #12100D; color: #F8F5EF; padding: 12px 24px; text-decoration: none; margin-top: 16px;">Reset Password</a>
          <p style="color: #888; font-size: 13px; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Password reset email failed:", error);
  }

  return { success: true };
}

export async function resetPassword(email: string, token: string, newPassword: string) {
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters" };

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: `password-reset:${email}`, token } },
  });

  if (!record || record.expires < new Date()) {
    return { error: "This reset link is invalid or has expired" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { hashedPassword } });
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: `password-reset:${email}`, token } },
  });

  return { success: true };
}
