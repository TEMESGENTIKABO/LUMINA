import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function getFlagshipArticles(kind: "opinion" | "investigations"): Promise<Article[]> {
  const cat = await prisma.category.findUnique({ where: { slug: kind } });
  if (!cat) return [];

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: cat.id },
    orderBy: { publishedAt: "desc" },
    include: articleIncludeShape,
  });
  return articles.map(mapDbArticleToArticle);
}
