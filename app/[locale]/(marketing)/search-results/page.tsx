import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { mapDbArticleToArticle, articleIncludeShape } from "@/content/cms/db/mapArticle";
import { ArticleCard } from "@/components/ui/Card";

export default async function SearchResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; author?: string; from?: string; to?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;

  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ where: { parentId: null }, orderBy: { name_en: "asc" } }),
    prisma.user.findMany({ where: { role: { in: ["AUTHOR", "EDITOR", "ADMIN"] } }, orderBy: { name: "asc" } }),
  ]);

  const hasQuery = sp.q || sp.category || sp.author || sp.from || sp.to;
  let results: ReturnType<typeof mapDbArticleToArticle>[] = [];

  if (hasQuery) {
    const where: any = { status: "PUBLISHED" };
    if (sp.q) where.OR = [{ title_en: { contains: sp.q, mode: "insensitive" } }, { dek_en: { contains: sp.q, mode: "insensitive" } }];
    if (sp.category) where.category = { slug: sp.category };
    if (sp.author) where.author = { slug: sp.author };
    if (sp.from || sp.to) {
      where.publishedAt = {};
      if (sp.from) where.publishedAt.gte = new Date(sp.from);
      if (sp.to) where.publishedAt.lte = new Date(sp.to);
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: articleIncludeShape,
    });
    results = articles.map(mapDbArticleToArticle);
  }

  return (
    <main className="max-w-page mx-auto px-6 pt-8 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)] mb-6">Advanced Search</h1>

      <form method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-3 border-b border-hairline pb-6 mb-8">
        <input name="q" defaultValue={sp.q} placeholder="Keywords" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white md:col-span-2" />
        <select name="category" defaultValue={sp.category ?? ""} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
          <option value="">All categories</option>
          {categories.map((c) => (<option key={c.slug} value={c.slug}>{c.name_en}</option>))}
        </select>
        <select name="author" defaultValue={sp.author ?? ""} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
          <option value="">All authors</option>
          {authors.map((a) => (<option key={a.id} value={a.slug ?? a.id}>{a.name ?? a.email}</option>))}
        </select>
        <button type="submit" className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2">Search</button>
        <input name="from" type="date" defaultValue={sp.from} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
        <input name="to" type="date" defaultValue={sp.to} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
        {hasQuery && <Link href={`/${locale}/search-results`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black self-center">Clear filters</Link>}
      </form>

      {!hasQuery ? (
        <p className="font-ui text-sm text-obsidian-grey">Enter a keyword or choose filters above to search.</p>
      ) : results.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">No results found.</p>
      ) : (
        <>
          <p className="font-ui text-xs text-obsidian-grey mb-6">{results.length} result{results.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {results.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
