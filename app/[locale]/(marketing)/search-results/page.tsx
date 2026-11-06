import "@/components/homepage/home.css";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  mapDbArticleToArticle,
  articleIncludeShape,
} from "@/content/cms/db/mapArticle";
import { SectionHead } from "@/components/homepage/SectionHead";
import { StoryCard } from "@/components/homepage/StoryCard";
import { getLabels } from "@/lib/labels";

export default async function SearchResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    author?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const L = getLabels(locale);

  const [categories, authors] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name_en: "asc" },
    }),
    prisma.user.findMany({
      where: { role: { in: ["AUTHOR", "EDITOR", "ADMIN"] } },
      orderBy: { name: "asc" },
    }),
  ]);

  const hasQuery = !!(sp.q || sp.category || sp.author || sp.from || sp.to);
  let results: ReturnType<typeof mapDbArticleToArticle>[] = [];

  if (hasQuery) {
    const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };
    if (sp.q)
      where.OR = [
        { title_en: { contains: sp.q, mode: "insensitive" } },
        { dek_en: { contains: sp.q, mode: "insensitive" } },
      ];
    if (sp.category) where.category = { slug: sp.category };
    if (sp.author) where.author = { slug: sp.author };
    if (sp.from || sp.to) {
      where.publishedAt = {};
      if (sp.from) where.publishedAt.gte = new Date(sp.from);
      if (sp.to) where.publishedAt.lte = new Date(sp.to);
    }
    const rows = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: articleIncludeShape,
    });
    results = rows.map(mapDbArticleToArticle);
  }

  return (
    <div className="hp">
      <div className="hp-w" style={{ padding: "36px 20px 64px" }}>
        <SectionHead kicker={L.search} title={sp.q ? `“${sp.q}”` : L.search} />

        <form
          method="GET"
          style={{ display: "grid", gap: 10, marginBottom: 28 }}
          className="md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"
        >
          <input
            name="q"
            defaultValue={sp.q}
            placeholder={L.keywords}
            aria-label={L.keywords}
            className="hp-input"
          />
          <select
            name="category"
            defaultValue={sp.category ?? ""}
            aria-label={L.allCategories}
            className="hp-input"
          >
            <option value="">{L.allCategories}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name_en}
              </option>
            ))}
          </select>
          <select
            name="author"
            defaultValue={sp.author ?? ""}
            aria-label={L.allAuthors}
            className="hp-input"
          >
            <option value="">{L.allAuthors}</option>
            {authors.map((a) => (
              <option key={a.id} value={a.slug ?? a.id}>
                {a.name ?? a.email}
              </option>
            ))}
          </select>
          <input
            name="from"
            type="date"
            defaultValue={sp.from}
            aria-label={L.from}
            className="hp-input"
          />
          <input
            name="to"
            type="date"
            defaultValue={sp.to}
            aria-label={L.to}
            className="hp-input"
          />
          <button type="submit" className="hp-btn">
            {L.search}
          </button>
        </form>
        {hasQuery && (
          <Link
            href={`/${locale}/search-results`}
            className="hp-va"
            style={{ marginBottom: 24 }}
          >
            {L.clearFilters}
          </Link>
        )}

        {!hasQuery ? (
          <p style={{ color: "var(--hp-mut)" }}>{L.enterKeyword}</p>
        ) : results.length === 0 ? (
          <p style={{ color: "var(--hp-mut)" }}>
            {L.noResults} “{sp.q ?? ""}”
          </p>
        ) : (
          <>
            <p className="hp-meta" style={{ marginBottom: 20 }}>
              {results.length} {results.length === 1 ? L.result : L.results}
            </p>
            <div className="hp-grid c3">
              {results.map((a) => (
                <StoryCard key={a.slug} article={a} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
