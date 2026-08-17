import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalArticles, publishedArticles, draftArticles, scheduledArticles, totalUsers, totalMedia] =
    await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.article.count({ where: { status: "SCHEDULED" } }),
      prisma.user.count(),
      prisma.media.count(),
    ]);

  return { totalArticles, publishedArticles, draftArticles, scheduledArticles, totalUsers, totalMedia };
}

export async function getRecentActivity() {
  return prisma.article.findMany({
    take: 8,
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });
}

export async function getNeedsAttention() {
  const [inReview, recentComments] = await Promise.all([
    prisma.article.findMany({
      where: { status: "IN_REVIEW" },
      orderBy: { updatedAt: "asc" },
      take: 5,
      include: { author: true },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
  ]);

  return { inReview, recentComments };
}
