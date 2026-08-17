// RelatedStoriesEnd.tsx
import { ArticleCard } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";
import { Newspaper } from "lucide-react";

export function RelatedStoriesEnd({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  // Remove duplicate articles based on slug
  const uniqueArticles = articles.filter(
    (article, index, self) =>
      index === self.findIndex((a) => a.slug === article.slug),
  );

  return (
    <section className="max-w-page mx-auto px-6 mt-14 pt-8 border-t border-obsidian-grey/10">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="text-obsidian-grey/40" size={20} />
        <SectionHeader label="Related Coverage" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {uniqueArticles.map((article) => (
          <div key={article.slug} className="hover:shadow-md transition-shadow">
            <ArticleCard article={article} locale={locale} />
          </div>
        ))}
      </div>
    </section>
  );
}
