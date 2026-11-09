import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { generalLimiter, getClientIp } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);

// Set RESEND_FROM (for example "AKSUM <hello@your-domain>") after verifying
// your domain in Resend. The fallback below only delivers to the account owner.
const FROM = process.env.RESEND_FROM ?? "AKSUM <onboarding@resend.dev>";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  topics: z.array(z.string().max(40)).max(10).default(["morning-brief"]),
});

export async function POST(request: NextRequest) {
  const { success } = await generalLimiter.limit(getClientIp(request));
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, topics: parsed.data.topics },
    update: { topics: parsed.data.topics },
  });

  try {
    await resend.emails.send({
      from: FROM,
      to: parsed.data.email,
      subject: "Welcome to AKSUM",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="font-size: 22px;">Welcome to AKSUM</h1>
          <p style="color: #444;">You're subscribed. Ancient roots. Modern voice.</p>
        </div>
      `,
    });
  } catch (error) {
    // Don't fail the subscription if the welcome email fails to send -
    // the subscriber record is what matters most.
    console.error("Welcome email failed:", error);
  }

  return NextResponse.json({ success: true });
}
