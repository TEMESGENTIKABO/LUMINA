import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/dataCache";

export async function getFeaturedTopics(limit = 8) {
  return cached("homepage:featured-topics", 300, async () => {
    const topics = await prisma.topic.findMany({
      where: { published: true },
      include: { _count: { select: { articles: true } } },
      orderBy: { articles: { _count: "desc" } },
      take: limit,
    });
    return topics
      .filter((t) => t._count.articles > 0)
      .map((t) => ({ slug: t.slug, title: t.title, count: t._count.articles }));
  });
}
