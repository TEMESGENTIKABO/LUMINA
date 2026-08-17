import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import type { Article } from "@/content/types/Article";

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];

  const matches = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "Article"
    WHERE status = 'PUBLISHED'
      AND "searchVector" @@ websearch_to_tsquery('english', ${q})
    ORDER BY ts_rank("searchVector", websearch_to_tsquery('english', ${q})) DESC
    LIMIT 20
  `;

  if (matches.length === 0) {
    // Fallback to substring matching - websearch_to_tsquery can return zero
    // results for very short or unusual queries where a plain ILIKE would
    // still find something useful.
    const fallback = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title_en: { contains: q, mode: "insensitive" } },
          { title_am: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      include: articleIncludeShape,
    });
    return fallback.map(mapDbArticleToArticle);
  }

  const articles = await prisma.article.findMany({
    where: { id: { in: matches.map((m) => m.id) } },
    include: articleIncludeShape,
  });

  // Preserve the relevance-ranked order from the raw query.
  const order = new Map(matches.map((m, i) => [m.id, i]));
  articles.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return articles.map(mapDbArticleToArticle);
}
