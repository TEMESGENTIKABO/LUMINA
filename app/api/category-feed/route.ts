import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

const PAGE_SIZE = 9;

export async function GET(request: NextRequest) {
  const categorySlug = request.nextUrl.searchParams.get("category");
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  if (!categorySlug) return NextResponse.json({ error: "category required" }, { status: 400 });

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return NextResponse.json({ articles: [], hasMore: false });

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", categoryId: category.id },
      orderBy: { publishedAt: "desc" },
      include: articleIncludeShape,
      skip: PAGE_SIZE * 3 + page * PAGE_SIZE, // skip past the initial server-rendered hero + first feed page
      take: PAGE_SIZE,
    }),
    prisma.article.count({ where: { status: "PUBLISHED", categoryId: category.id } }),
  ]);

  return NextResponse.json({
    articles: articles.map(mapDbArticleToArticle),
    hasMore: PAGE_SIZE * 3 + (page + 1) * PAGE_SIZE < total,
  });
}
