import { prisma } from "@/lib/prisma";

export async function getCalendarArticles(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);

  const articles = await prisma.article.findMany({
    where: {
      OR: [
        { status: "SCHEDULED", scheduledAt: { gte: start, lt: end } },
        { status: "PUBLISHED", publishedAt: { gte: start, lt: end } },
      ],
    },
    select: { id: true, title_en: true, status: true, scheduledAt: true, publishedAt: true, author: { select: { name: true, email: true } } },
  });

  return articles;
}
