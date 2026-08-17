import { Carousel } from "@/components/ui/Carousel";
import { ArticleCard } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

export function EntertainmentSpotlight({
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
        label="Entertainment Spotlight"
        href="/culture/entertainment"
        locale={locale}
      />
      <Carousel>
        {articles.map((article) => (
          <div
            key={article.slug}
            className="flex-shrink-0 w-64 transition-transform duration-300 hover:-translate-y-1"
          >
            <ArticleCard article={article} locale={locale} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}
