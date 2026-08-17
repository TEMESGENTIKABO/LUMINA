import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

// Three-slot design per original blueprint Section 2.6:
// same-topic, same-author, cross-category (serendipity).
export async function getRelatedArticles(currentSlug: string, category: string): Promise<Article[]> {
  const current = await prisma.article.findUnique({
    where: { slug: currentSlug },
    include: { topics: true },
  });
  if (!current) return [];

  const results: Article[] = [];
  const usedIds = new Set([current.id]);

  // Slot 1: same-topic
  if (current.topics.length > 0) {
    const topicMatch = await prisma.articleTopic.findFirst({
      where: {
        topicId: { in: current.topics.map((t) => t.topicId) },
        articleId: { not: current.id },
        article: { status: "PUBLISHED" },
      },
      include: { article: { include: articleIncludeShape } },
      orderBy: { article: { publishedAt: "desc" } },
    });
    if (topicMatch && !usedIds.has(topicMatch.article.id)) {
      results.push(mapDbArticleToArticle(topicMatch.article));
      usedIds.add(topicMatch.article.id);
    }
  }

  // Slot 2: same-author
  const authorMatch = await prisma.article.findFirst({
    where: { authorId: current.authorId, status: "PUBLISHED", id: { notIn: Array.from(usedIds) } },
    include: articleIncludeShape,
    orderBy: { publishedAt: "desc" },
  });
  if (authorMatch) {
    results.push(mapDbArticleToArticle(authorMatch));
    usedIds.add(authorMatch.id);
  }

  // Slot 3: cross-category serendipity - different category than the current article
  const crossMatch = await prisma.article.findFirst({
    where: { status: "PUBLISHED", categoryId: { not: current.categoryId }, id: { notIn: Array.from(usedIds) } },
    include: articleIncludeShape,
    orderBy: { publishedAt: "desc" },
  });
  if (crossMatch) {
    results.push(mapDbArticleToArticle(crossMatch));
  }

  // Fallback: if any slot came up empty (e.g. author has no other articles),
  // fill remaining spots with same-category recency so the section is never sparse.
  if (results.length < 3) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) {
      const fallback = await prisma.article.findMany({
        where: { status: "PUBLISHED", categoryId: cat.id, id: { notIn: Array.from(usedIds) } },
        include: articleIncludeShape,
        orderBy: { publishedAt: "desc" },
        take: 3 - results.length,
      });
      results.push(...fallback.map(mapDbArticleToArticle));
    }
  }

  return results;
}
