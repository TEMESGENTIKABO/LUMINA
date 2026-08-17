import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";
import { cached } from "@/lib/dataCache";
export interface TrendingItem {
  article: Article;
  direction: "up" | "down" | "flat";
}

// Real velocity-based trending: reads in the last 6 hours vs. the 6 hours
// before that, replacing the earlier recency-only approximation.
export async function getTrendingArticles(): Promise<TrendingItem[]> {
  return cached("homepage:trending", 120, async () => {
    const now = new Date();
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const recentViews = await prisma.pageView.groupBy({
    by: ["articleSlug"],
    where: { createdAt: { gte: sixHoursAgo } },
    _count: { articleSlug: true },
  });

  if (recentViews.length === 0) {
    // No traffic data yet - fall back to recency so the section isn't empty
    // during early development/low-traffic periods.
    const fallback = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: articleIncludeShape,
    });
    return fallback.map((a) => ({ article: mapDbArticleToArticle(a), direction: "flat" as const }));
  }

  const priorViews = await prisma.pageView.groupBy({
    by: ["articleSlug"],
    where: { createdAt: { gte: twelveHoursAgo, lt: sixHoursAgo } },
    _count: { articleSlug: true },
  });
  const priorMap = new Map(priorViews.map((v) => [v.articleSlug, v._count.articleSlug]));

  const ranked = recentViews
    .sort((a, b) => b._count.articleSlug - a._count.articleSlug)
    .slice(0, 5);

  const articles = await prisma.article.findMany({
    where: { slug: { in: ranked.map((r) => r.articleSlug) }, status: "PUBLISHED" },
    include: articleIncludeShape,
  });

  const results: TrendingItem[] = [];
  for (const r of ranked) {
    const article = articles.find((a) => a.slug === r.articleSlug);
    if (!article) continue;
    const priorCount = priorMap.get(r.articleSlug) ?? 0;
    const direction: TrendingItem["direction"] =
      r._count.articleSlug > priorCount ? "up" : r._count.articleSlug < priorCount ? "down" : "flat";
    results.push({ article: mapDbArticleToArticle(article), direction });
  }
  return results;
  });
}
