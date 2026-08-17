import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";

export const revalidate = 300;

function formatToday(locale: string) {
  return new Date().toLocaleDateString(locale === "am" ? "am-ET" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TodaysPaperPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let dbArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { gte: startOfDay } },
    orderBy: { publishedAt: "desc" },
    include: articleIncludeShape,
    take: 12,
  });

  // If nothing published yet today, fall back to the most recent day's front
  // page rather than showing an empty edition.
  if (dbArticles.length === 0) {
    dbArticles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: articleIncludeShape,
      take: 12,
    });
  }

  const articles = dbArticles.map(mapDbArticleToArticle);
  const [lead, ...rest] = articles;

  if (!lead) {
    return (
      <main className="max-w-page mx-auto px-6 pt-12 pb-20 text-center">
        <p className="font-ui text-sm text-obsidian-grey">No published articles yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-20">
      <div className="text-center hairline-b pb-6 mb-8">
        <p className="section-label text-obsidian-grey/60">Today's Paper</p>
        <h1 className="font-headline-en text-5xl font-bold tracking-tight mt-1">AKSUM</h1>
        <p className="font-ui text-sm text-obsidian-grey mt-2 tabular-nums">{formatToday(locale)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 hairline-b pb-8 mb-8">
        <Link href={`/${locale}/article/${lead.slug}`} className="lg:col-span-2 group block">
          <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-grey/10">
            <Image src={lead.heroImageUrl} alt={lead.title_en} fill priority sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
          </div>
          <p className="section-label mt-3" style={{ color: `var(--color-${lead.accentColor})` }}>{lead.subcategory ?? lead.category}</p>
          <h2 className="font-headline-en text-3xl leading-[1.05] mt-1 group-hover:text-manuscript-red transition-colors">{lead.title_en}</h2>
          <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-2">{lead.dek_en}</p>
        </Link>

        <div className="flex flex-col divide-y divide-hairline">
          {rest.slice(0, 3).map((a) => (
            <Link key={a.slug} href={`/${locale}/article/${a.slug}`} className="group py-3 first:pt-0">
              <p className="section-label" style={{ color: `var(--color-${a.accentColor})` }}>{a.subcategory ?? a.category}</p>
              <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-1 group-hover:text-manuscript-red transition-colors">
                {a.title_en}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {rest.length > 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rest.slice(3).map((a) => (
            <Link key={a.slug} href={`/${locale}/article/${a.slug}`} className="group block">
              <p className="section-label" style={{ color: `var(--color-${a.accentColor})` }}>{a.subcategory ?? a.category}</p>
              <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-1 group-hover:text-manuscript-red transition-colors">
                {a.title_en}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
