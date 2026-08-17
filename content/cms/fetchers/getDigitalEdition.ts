import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getAllEditions() {
  return prisma.digitalEdition.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
}

export async function getEditionBySlug(slug: string) {
  const edition = await prisma.digitalEdition.findUnique({
    where: { slug },
    include: {
      articles: {
        include: { article: { include: articleIncludeShape } },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!edition || !edition.published) return null;

  return {
    edition,
    articles: edition.articles.map((ea) => mapDbArticleToArticle(ea.article)),
  };
}
