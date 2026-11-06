import { notFound } from "next/navigation";
import { getAuthorBySlug } from "@/content/cms/fetchers/getAuthor";
import { ArticleCard } from "@/components/ui/Card";

function formatMemberSince(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; authorSlug: string }>;
}) {
  const { locale, authorSlug } = await params;
  const result = await getAuthorBySlug(authorSlug);
  if (!result) notFound();

  const { author, articles, stats } = result;

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 hairline-b pb-8">
        <div className="w-20 h-20 rounded-full bg-obsidian-grey/10 flex-shrink-0" />
        <div className="flex-1">
          <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">{author.name}</h1>
          <p className="section-label text-manuscript-red mt-1">{author.beat}</p>
          <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3 max-w-content">{author.bio}</p>
          <p className="font-ui text-xs text-obsidian-grey/60 mt-3">Writing for AKSUM since {formatMemberSince(author.memberSince)}</p>
        </div>
        <div className="flex sm:flex-col gap-6 sm:gap-3 flex-shrink-0">
          <div>
            <p className="font-headline-en text-2xl tabular-nums">{stats.articleCount}</p>
            <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/60">Articles</p>
          </div>
          <div>
            <p className="font-headline-en text-2xl tabular-nums">{stats.totalViews.toLocaleString()}</p>
            <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/60">Total Reads</p>
          </div>
          {stats.topCategory && (
            <div>
              <p className="font-headline-en text-2xl truncate max-w-[120px]">{stats.topCategory}</p>
              <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/60">Top Beat</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        {articles.length === 0 ? (
          <p className="font-ui text-sm text-obsidian-grey">No published articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
