import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyApiKey } from "@/lib/apiKeyAuth";
import { generalLimiter } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (!auth) {
    return NextResponse.json({ error: "Invalid or missing API key. Use: Authorization: Bearer <key>" }, { status: 401 });
  }

  const { success } = await generalLimiter.limit(`apikey:${auth.userId}`);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? "20"), 50);
  const category = request.nextUrl.searchParams.get("category");

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(category ? { category: { slug: category } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      slug: true,
      title_en: true,
      dek_en: true,
      heroImageUrl: true,
      publishedAt: true,
      category: { select: { slug: true, name_en: true } },
      author: { select: { name: true, slug: true } },
    },
  });

  return NextResponse.json({ articles, count: articles.length });
}
