import { SITE_URL, SITE_NAME } from "@/lib/seo";

export function buildArticleJsonLd(
  article: {
    slug: string;
    title_en: string;
    dek_en: string;
    heroImageUrl?: string | null;
    category: string;
    subcategory?: string;
    author: { name: string; slug?: string };
    publishedAt: string;
    updatedAt?: string;
  },
  locale = "en",
) {
  const url = `${SITE_URL}/${locale}/article/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: article.title_en.slice(0, 110),
        description: article.dek_en,
        image: [article.heroImageUrl || `${url}/opengraph-image`],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        inLanguage: locale,
        articleSection: article.subcategory ?? article.category,
        author: [
          {
            "@type": "Person",
            name: article.author.name,
            url: article.author.slug
              ? `${SITE_URL}/${locale}/author/${article.author.slug}`
              : undefined,
          },
        ],
        publisher: {
          "@type": "NewsMediaOrganization",
          name: SITE_NAME,
          url: SITE_URL,
          // Google needs a PNG/JPG logo, not SVG. Add one at public/images/logo.png (600×60).
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/logo.png`,
            width: 600,
            height: 60,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.category,
            item: `${SITE_URL}/${locale}/${article.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title_en,
            item: url,
          },
        ],
      },
    ],
  };
}
