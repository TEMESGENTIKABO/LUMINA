import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

function escapeXml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { author: true, category: true },
  });

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/en/article/${a.slug}`;
      const pubDate = (a.publishedAt ?? a.createdAt).toUTCString();
      return `
    <item>
      <title>${escapeXml(a.title_en)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.dek_en)}</description>
      <author>${escapeXml(a.author.name ?? a.author.email ?? "AKSUM Staff")}</author>
      <category>${escapeXml(a.category.name_en)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Ancient roots. Modern voice. Premium bilingual Ethiopian journalism.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
