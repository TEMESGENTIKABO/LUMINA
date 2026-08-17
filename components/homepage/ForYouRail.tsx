import { ArticleCard } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

export function ForYouRail({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-6 hairline-t">
      <SectionHeader label="For You" />
      <p className="font-ui text-xs text-obsidian-grey/60 -mt-3 mb-5">
        Based on the topics you follow.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} locale={locale} />
        ))}
      </div>
    </section>
  );
}
