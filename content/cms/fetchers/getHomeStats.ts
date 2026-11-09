import { prisma } from "@/lib/prisma";

// Africa/Addis_Ababa is UTC+3 all year (no daylight saving).
const ADDIS_OFFSET_MS = 3 * 60 * 60 * 1000;

function startOfAddisDay(now: Date) {
  const shifted = new Date(now.getTime() + ADDIS_OFFSET_MS);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - ADDIS_OFFSET_MS);
}

export interface HomeStats {
  totalArticles: number;
  todayPublished: number;
  /** Page views in the last hour, or null if they cannot be counted. */
  recentViews: number | null;
}

export async function getHomeStats(): Promise<HomeStats> {
  const now = new Date();

  const [totalArticles, todayPublished] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        publishedAt: { gte: startOfAddisDay(now), lte: now },
      },
    }),
  ]);

  let recentViews: number | null = null;
  try {
    recentViews = await prisma.pageView.count({
      where: { createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } },
    });
  } catch {
    recentViews = null;
  }

  return { totalArticles, todayPublished, recentViews };
}
