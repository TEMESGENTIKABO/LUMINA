import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function getReadingHistory(userId: string, limit = 6): Promise<Article[]> {
  const views = await prisma.pageView.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    distinct: ["articleSlug"],
    take: limit,
  });
  if (views.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { slug: { in: views.map((v) => v.articleSlug) }, status: "PUBLISHED" },
    include: articleIncludeShape,
  });

  const order = new Map(views.map((v, i) => [v.articleSlug, i]));
  articles.sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));

  return articles.map(mapDbArticleToArticle);
}
