import { ArticleCard } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

export function TechnologyGrid({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <SectionHeader
        label="Technology"
        href="/business-tech/technology"
        locale={locale}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} />
        ))}
      </div>
    </section>
  );
}
