import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function getHomepageArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: articleIncludeShape,
  });
  return articles.map(mapDbArticleToArticle);
}
