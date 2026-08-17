import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getMostDiscussed() {
  const grouped = await prisma.comment.groupBy({
    by: ["articleSlug"],
    _count: { articleSlug: true },
    orderBy: { _count: { articleSlug: "desc" } },
    take: 4,
  });

  if (grouped.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { slug: { in: grouped.map((g) => g.articleSlug) }, status: "PUBLISHED" },
    include: articleIncludeShape,
  });

  return grouped
    .map((g) => {
      const article = articles.find((a) => a.slug === g.articleSlug);
      if (!article) return null;
      return { article: mapDbArticleToArticle(article), commentCount: g._count.articleSlug };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}
