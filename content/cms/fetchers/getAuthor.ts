import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getAuthorBySlug(slugOrId: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
  });
  if (!user) return null;

  const articles = await prisma.article.findMany({
    where: { authorId: user.id, status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: articleIncludeShape,
  });

  return {
    author: {
      slug: user.slug ?? user.id,
      name: user.name ?? user.email ?? "AKSUM Staff",
      bio: user.bio ?? "AKSUM contributor.",
      beat: user.beat ?? "Contributor",
    },
    articles: articles.map(mapDbArticleToArticle),
  };
}
