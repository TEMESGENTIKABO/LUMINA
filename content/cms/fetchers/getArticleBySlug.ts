import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import { renderTiptapJson } from "@/lib/renderTiptapJson";
import type { Article } from "@/content/types/Article";

export interface FullArticle extends Article {
  bodyHtml: string;
  bodyHtmlAm: string | null;
  hasAmharicBody: boolean;
}

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: articleIncludeShape,
  });
  if (!article) return null;

  const bodyHtmlAm = article.body_am ? renderTiptapJson(article.body_am as object) : null;

  return {
    ...mapDbArticleToArticle(article),
    bodyHtml: renderTiptapJson(article.body_en as object),
    bodyHtmlAm,
    hasAmharicBody: Boolean(bodyHtmlAm),
  };
}
