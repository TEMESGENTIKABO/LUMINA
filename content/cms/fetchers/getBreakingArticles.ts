import { prisma } from "@/lib/prisma";
import { cached } from "@/lib/dataCache";

export async function getBreakingArticles() {
  return cached("global:breaking", 60, async () => {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED", isBreaking: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      select: { slug: true, title_en: true },
    });
    return articles.map((a) => ({ title: a.title_en, href: `/en/article/${a.slug}` }));
  });
}
