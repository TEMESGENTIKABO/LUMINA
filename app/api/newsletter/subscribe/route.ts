import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email(),
  topics: z.array(z.string()).default(["morning-brief"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
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
      from: "AKSUM <onboarding@resend.dev>",
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
