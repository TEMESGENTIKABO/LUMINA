import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ following: false });

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const existing = await prisma.followedTopic.findUnique({
    where: { userId_topicSlug: { userId: session.user.id, topicSlug: slug } },
  });

  return NextResponse.json({ following: Boolean(existing) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { topicSlug } = await request.json();
  if (!topicSlug) return NextResponse.json({ error: "Missing topicSlug" }, { status: 400 });

  const existing = await prisma.followedTopic.findUnique({
    where: { userId_topicSlug: { userId: session.user.id, topicSlug } },
  });

  if (existing) {
    await prisma.followedTopic.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  }

  await prisma.followedTopic.create({ data: { userId: session.user.id, topicSlug } });
  return NextResponse.json({ following: true });
}