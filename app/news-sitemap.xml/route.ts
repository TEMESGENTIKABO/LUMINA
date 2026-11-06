import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 600;
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { gte: since } },
    orderBy: { publishedAt: "desc" },
    take: 1000,
    select: { slug: true, title_en: true, publishedAt: true },
  });

  const items = rows
    .map(
      (a) =>
        `<url><loc>${SITE_URL}/en/article/${esc(a.slug)}</loc><news:news><news:publication><news:name>${esc(SITE_NAME)}</news:name><news:language>en</news:language></news:publication><news:publication_date>${a.publishedAt!.toISOString()}</news:publication_date><news:title>${esc(a.title_en)}</news:title></news:news></url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
