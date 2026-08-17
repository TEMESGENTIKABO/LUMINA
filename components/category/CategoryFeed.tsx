import { ArticleCard } from "@/components/ui/Card";
import type { Article } from "@/content/types/Article";

export function CategoryFeed({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) {
    return <p className="font-ui text-sm text-obsidian-grey py-8">No more stories in this section yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 py-8">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} locale={locale} />
      ))}
    </div>
  );
}
