import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export async function getEditorsPicks() {
  const picks = await prisma.editorsPick.findMany({
    orderBy: { position: "asc" },
    include: { article: { include: articleIncludeShape } },
  });
  return picks.filter((p) => p.article.status === "PUBLISHED").map((p) => mapDbArticleToArticle(p.article));
}
