import { ArticleCard } from "@/components/ui/Card";
import type { Article } from "@/content/types/Article";

export function AuthorArchive({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  return (
    <section className="max-w-page mx-auto px-6 mt-12 pt-8 border-t border-obsidian-grey/10 pb-16">
      <h2 className="font-headline-en text-[length:var(--text-headline-md)] mb-6">
        Articles by this author
      </h2>
      {articles.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">
          No published articles yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
