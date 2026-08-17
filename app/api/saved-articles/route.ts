import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ saved: false });

  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const existing = await prisma.savedArticle.findUnique({
    where: { userId_articleSlug: { userId: session.user.id, articleSlug: slug } },
  });

  return NextResponse.json({ saved: Boolean(existing) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { articleSlug } = await request.json();
  if (!articleSlug) return NextResponse.json({ error: "Missing articleSlug" }, { status: 400 });

  const existing = await prisma.savedArticle.findUnique({
    where: { userId_articleSlug: { userId: session.user.id, articleSlug } },
  });

  if (existing) {
    await prisma.savedArticle.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedArticle.create({ data: { userId: session.user.id, articleSlug } });
  return NextResponse.json({ saved: true });
}