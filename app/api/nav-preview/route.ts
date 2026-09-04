import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/dataCache";

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("category");
  if (!categorySlug) return NextResponse.json({ error: "category required" }, { status: 400 });

  const data = await cached(`nav-preview:${categorySlug}`, 300, async () => {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return null;

    const article = await prisma.article.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [{ categoryId: category.id }, { category: { parentId: category.id } }],
      },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title_en: true, heroImageUrl: true },
    });

    return article;
  });

  return NextResponse.json({ article: data });
}
