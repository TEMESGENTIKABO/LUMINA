import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generalLimiter, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const { success } = await generalLimiter.limit(getClientIp(request));
  if (!success) return NextResponse.json({ ok: false }, { status: 429 });

  const { articleSlug } = await request.json();
  if (!articleSlug) return NextResponse.json({ ok: false }, { status: 400 });

  const session = await auth();
  await prisma.pageView.create({ data: { articleSlug, userId: session?.user?.id ?? null } });
  return NextResponse.json({ ok: true });
}
