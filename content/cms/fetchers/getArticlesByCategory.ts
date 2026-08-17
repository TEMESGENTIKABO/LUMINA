import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function getArticlesByCategory(category: string, subcategory?: string): Promise<Article[]> {
  const targetSlug = subcategory ?? category;

  const targetCategory = await prisma.category.findUnique({ where: { slug: targetSlug } });
  if (!targetCategory) return [];

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: targetCategory.id },
    orderBy: { publishedAt: "desc" },
    include: articleIncludeShape,
  });
  return articles.map(mapDbArticleToArticle);
}

// Genuine popularity proxy: ranked by comment count within the category, not
// just recency. Not true pageview-based "most read" (no analytics pipeline
// exists yet - see Product Specification Section 7), but a real engagement
// signal rather than a mislabeled recency list.
export async function getMostReadInCategory(category: string): Promise<Article[]> {
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return [];

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId: cat.id },
    include: articleIncludeShape,
  });
  if (articles.length === 0) return [];

  const commentCounts = await prisma.comment.groupBy({
    by: ["articleSlug"],
    where: { articleSlug: { in: articles.map((a) => a.slug) } },
    _count: { articleSlug: true },
  });
  const countMap = new Map(commentCounts.map((c) => [c.articleSlug, c._count.articleSlug]));

  const ranked = articles.sort((a, b) => {
    const diff = (countMap.get(b.slug) ?? 0) - (countMap.get(a.slug) ?? 0);
    if (diff !== 0) return diff;
    // Tie-break by recency when comment counts are equal (including both-zero, the common case for new content).
    return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
  });

  return ranked.slice(0, 4).map(mapDbArticleToArticle);
}
