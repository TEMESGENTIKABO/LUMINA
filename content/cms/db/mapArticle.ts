import type { Article } from "@/content/types/Article";

// Shape returned by Prisma when article is queried with { include: { category: { include: { parent: true } }, author: true, tags: { include: { tag: true } } } }
export function mapDbArticleToArticle(dbArticle: any): Article {
  return {
    slug: dbArticle.slug,
    category: dbArticle.category.parent ? dbArticle.category.parent.slug : dbArticle.category.slug,
    subcategory: dbArticle.category.parent ? dbArticle.category.slug : undefined,
    accentColor: dbArticle.category.accentColor,
    title_en: dbArticle.title_en,
    title_am: dbArticle.title_am ?? undefined,
    dek_en: dbArticle.dek_en,
    dek_am: dbArticle.dek_am ?? undefined,
    author: {
      name: dbArticle.author.name ?? dbArticle.author.email ?? "AKSUM Staff",
      slug: dbArticle.author.slug ?? dbArticle.author.id,
      avatarUrl: dbArticle.author.image ?? undefined,
    },
    heroImageUrl: dbArticle.heroImageUrl ?? "/images/gerd.svg",
    heroImageCaption: dbArticle.heroImageCaption ?? undefined,
    publishedAt: (dbArticle.publishedAt ?? dbArticle.createdAt).toISOString(),
    updatedAt: dbArticle.updatedAt?.toISOString(),
    readTimeMinutes: dbArticle.readTimeMinutes,
    isBreaking: dbArticle.isBreaking,
  };
}

export const articleIncludeShape = {
  category: { include: { parent: true } },
  author: true,
  tags: { include: { tag: true } },
} as const;
