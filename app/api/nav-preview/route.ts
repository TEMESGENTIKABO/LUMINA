import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/dataCache";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("category");
  if (!param)
    return NextResponse.json({ error: "category required" }, { status: 400 });
  const parts = param.split("/").filter(Boolean);

  const articles = await cached(`nav-preview:v3:${param}`, 300, async () => {
    // Most specific slug first ("news/ethiopia" → "ethiopia"), then the parent ("news").
    let category = null;
    for (const slug of [parts[parts.length - 1], parts[0]]) {
      category = await prisma.category.findUnique({ where: { slug } });
      if (category) break;
    }
    if (!category) return [];

    return prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { categoryId: category.id },
          { category: { parentId: category.id } },
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title_en: true,
        title_am: true,
        dek_en: true,
        dek_am: true,
        heroImageUrl: true,
        category: { select: { name_en: true, name_am: true } },
      },
    });
  });

  return NextResponse.json({ articles });
}
