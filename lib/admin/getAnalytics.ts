import { prisma } from "@/lib/prisma";

export async function getViewsOverTime(days = 14) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  startDate.setHours(0, 0, 0, 0);

  const views = await prisma.pageView.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of views) {
    const key = v.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date: date.slice(5), views: count }));
}

export async function getTopArticles(limit = 10) {
  const grouped = await prisma.pageView.groupBy({
    by: ["articleSlug"],
    _count: { articleSlug: true },
    orderBy: { _count: { articleSlug: "desc" } },
    take: limit,
  });
  if (grouped.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { slug: { in: grouped.map((g) => g.articleSlug) } },
    select: { slug: true, title_en: true, category: { select: { name_en: true } } },
  });

  return grouped
    .map((g) => {
      const article = articles.find((a) => a.slug === g.articleSlug);
      if (!article) return null;
      return { slug: article.slug, title: article.title_en, category: article.category.name_en, views: g._count.articleSlug };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

export async function getViewsByCategory() {
  const views = await prisma.pageView.findMany({ select: { articleSlug: true } });
  if (views.length === 0) return [];

  const articles = await prisma.article.findMany({
    where: { slug: { in: [...new Set(views.map((v) => v.articleSlug))] } },
    select: { slug: true, category: { select: { name_en: true, accentColor: true } } },
  });
  const articleMap = new Map(articles.map((a) => [a.slug, a.category]));

  const counts = new Map<string, { count: number; color: string }>();
  for (const v of views) {
    const cat = articleMap.get(v.articleSlug);
    if (!cat) continue;
    const existing = counts.get(cat.name_en) ?? { count: 0, color: cat.accentColor };
    counts.set(cat.name_en, { count: existing.count + 1, color: cat.accentColor });
  }

  return Array.from(counts.entries()).map(([name, data]) => ({ name, views: data.count, color: data.color }));
}
