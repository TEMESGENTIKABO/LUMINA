import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  await prisma.newsletterSubscriber.deleteMany({ where: { email } });

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family: Georgia, serif; text-align: center; padding: 64px;">
      <h1>You've been unsubscribed</h1>
      <p style="color: #666;">${email} will no longer receive AKSUM emails.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
