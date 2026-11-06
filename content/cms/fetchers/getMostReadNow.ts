import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import { cached } from "@/lib/dataCache";

export async function getMostReadNow(excludeSlug?: string) {
  return cached(`most-read-now:${excludeSlug ?? "global"}`, 120, async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const grouped = await prisma.pageView.groupBy({
      by: ["articleSlug"],
      where: { createdAt: { gte: oneHourAgo }, ...(excludeSlug ? { articleSlug: { not: excludeSlug } } : {}) },
      _count: { articleSlug: true },
      orderBy: { _count: { articleSlug: "desc" } },
      take: 5,
    });
    if (grouped.length === 0) return [];

    const articles = await prisma.article.findMany({
      where: { slug: { in: grouped.map((g) => g.articleSlug) }, status: "PUBLISHED" },
      include: articleIncludeShape,
    });

    return grouped
      .map((g) => {
        const article = articles.find((a) => a.slug === g.articleSlug);
        return article ? mapDbArticleToArticle(article) : null;
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);
  });
}
