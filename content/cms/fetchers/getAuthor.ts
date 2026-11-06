import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getAuthorBySlug(slugOrId: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
  });
  if (!user) return null;

  const articles = await prisma.article.findMany({
    where: { authorId: user.id, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: articleIncludeShape,
  });

  const [totalViews, categoryBreakdown] = await Promise.all([
    prisma.pageView.count({ where: { articleSlug: { in: articles.map((a) => a.slug) } } }),
    prisma.article.groupBy({
      by: ["categoryId"],
      where: { authorId: user.id, status: "PUBLISHED" },
      _count: { categoryId: true },
    }),
  ]);

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryBreakdown.map((c) => c.categoryId) } },
  });
  const topCategory = categoryBreakdown.sort((a, b) => b._count.categoryId - a._count.categoryId)[0];
  const topCategoryName = categories.find((c) => c.id === topCategory?.categoryId)?.name_en;

  return {
    author: {
      slug: user.slug ?? user.id,
      name: user.name ?? user.email ?? "AKSUM Staff",
      bio: user.bio ?? "AKSUM contributor.",
      beat: user.beat ?? "Contributor",
      memberSince: user.createdAt,
    },
    articles: articles.map(mapDbArticleToArticle),
    stats: { articleCount: articles.length, totalViews, topCategory: topCategoryName },
  };
}
