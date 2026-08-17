import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getAllTopics() {
  return prisma.topic.findMany({ where: { published: true }, orderBy: { title: "asc" } });
}

export async function getTopicBySlug(slug: string) {
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic || !topic.published) return null;

  const links = await prisma.articleTopic.findMany({
    where: { topicId: topic.id },
    include: { article: { include: articleIncludeShape } },
  });

  const published = links
    .map((l) => l.article)
    .filter((a) => a.status === "PUBLISHED")
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));

  return { topic, articles: published.map(mapDbArticleToArticle) };
}
