import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/dataCache";

export async function getHomepageStats() {
  return cached("homepage:stats", 60, async () => {
    const [totalArticles, todayPublished, activeReaders] = await Promise.all([
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "PUBLISHED", publishedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.pageView.count({ where: { createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } } }),
    ]);
    return { totalArticles, todayPublished, activeReaders };
  });
}
