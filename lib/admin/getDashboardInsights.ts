import { prisma } from "@/lib/prisma";

const DAY = 86_400_000;
const OFFSET = 3 * 3_600_000; // Africa/Addis_Ababa (UTC+3)
const key = (t: number | Date) =>
  new Date(+t + OFFSET).toISOString().slice(0, 10);
const LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export async function getDashboardInsights() {
  const now = Date.now();
  const [created, byStatus, byCategory] = await Promise.all([
    prisma.article.findMany({
      where: { createdAt: { gte: new Date(now - 14 * DAY) } },
      select: { createdAt: true },
    }),
    prisma.article.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.article.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 5,
    }),
  ]);

  const cats = await prisma.category.findMany({
    where: { id: { in: byCategory.map((c) => c.categoryId) } },
    select: { id: true, name_en: true },
  });

  const perDay = new Map<string, number>();
  for (const a of created)
    perDay.set(key(a.createdAt), (perDay.get(key(a.createdAt)) ?? 0) + 1);

  const days = Array.from({ length: 14 }, (_, i) => {
    const t = now - (13 - i) * DAY;
    return {
      key: key(t),
      label: LETTERS[new Date(t + OFFSET).getUTCDay()],
      count: perDay.get(key(t)) ?? 0,
    };
  });

  return {
    days,
    lastWeek: days.slice(0, 7).reduce((s, d) => s + d.count, 0),
    thisWeek: days.slice(7).reduce((s, d) => s + d.count, 0),
    byStatus: byStatus.map((s) => ({
      status: s.status as string,
      count: s._count._all,
    })),
    topCategories: byCategory.map((c) => ({
      name: cats.find((x) => x.id === c.categoryId)?.name_en ?? "Uncategorized",
      count: c._count._all,
    })),
  };
}
