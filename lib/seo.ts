import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://aksum.example.com";
const SITE_NAME = "AKSUM";

async function getDefaultDescription(): Promise<string> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return settings?.defaultSeoDescription || "Premium bilingual Ethiopian journalism - news, culture, business, and investigations.";
}

export function buildArticleMetadata(article: {
  slug: string;
  title_en: string;
  dek_en: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
  heroImageUrl?: string | null;
  author: { name: string };
  publishedAt: string;
  locale: string;
}): Metadata {
  const title = article.seoTitle || article.title_en;
  const description = article.seoDescription || article.dek_en;
  const image = article.ogImageUrl || article.heroImageUrl || `${SITE_URL}/images/gerd.svg`;
  const url = `${SITE_URL}/${article.locale}/article/${article.slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image }],
      authors: [article.author.name],
      publishedTime: article.publishedAt,
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export async function buildCategoryMetadata(name: string, locale: string, slug: string): Promise<Metadata> {
  const title = `${name} | ${SITE_NAME}`;
  const description = await getDefaultDescription();
  const url = `${SITE_URL}/${locale}/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export async function buildHomepageMetadata(locale: string): Promise<Metadata> {
  const settings = await prisma.siteSettings.upsert({ where: { id: "singleton" }, create: { id: "singleton" }, update: {} });
  const title = `${settings.siteName} - ${locale === "am" && settings.tagline_am ? settings.tagline_am : settings.tagline_en}`;
  const description = settings.defaultSeoDescription || "Premium bilingual Ethiopian journalism - news, culture, business, and investigations.";
  const url = `${SITE_URL}/${locale}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: settings.siteName, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export { SITE_URL, SITE_NAME };
