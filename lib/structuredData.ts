import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function buildArticleJsonLd(article: {
  slug: string;
  title_en: string;
  dek_en: string;
  heroImageUrl?: string | null;
  author: { name: string };
  publishedAt: string;
  updatedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title_en,
    description: article.dek_en,
    image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/gerd.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/en/article/${article.slug}` },
  };
}
