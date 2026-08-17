import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function getForYouArticles(userId: string): Promise<Article[]> {
  const follows = await prisma.followedTopic.findMany({ where: { userId } });
  if (follows.length === 0) return [];

  const topics = await prisma.topic.findMany({
    where: { slug: { in: follows.map((f) => f.topicSlug) } },
  });
  if (topics.length === 0) return [];

  const links = await prisma.articleTopic.findMany({
    where: { topicId: { in: topics.map((t) => t.id) } },
    include: { article: { include: articleIncludeShape } },
    take: 30,
  });

  const seen = new Set<string>();
  const articles = links
    .map((l) => l.article)
    .filter((a) => {
      if (a.status !== "PUBLISHED" || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .slice(0, 6);

  return articles.map(mapDbArticleToArticle);
}
