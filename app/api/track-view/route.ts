import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generalLimiter, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const { success } = await generalLimiter.limit(getClientIp(request));
  if (!success) return NextResponse.json({ ok: false }, { status: 429 });

  const { articleSlug } = await request.json();
  if (!articleSlug) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.pageView.create({ data: { articleSlug } });
  return NextResponse.json({ ok: true });
}
