import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ topics: subscriber.topics });
}

export async function POST(request: NextRequest) {
  const { email, topics } = await request.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  await prisma.newsletterSubscriber.update({ where: { email }, data: { topics } });
  return NextResponse.json({ success: true });
}
