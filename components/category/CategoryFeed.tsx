import { StoryCard } from "@/components/homepage/StoryCard";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function CategoryFeed({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0)
    return (
      <p style={{ padding: "32px 0", color: "var(--hp-mut)" }}>
        {getLabels(locale).noStories}
      </p>
    );
  return (
    <div className="hp-grid c3" style={{ padding: "28px 0" }}>
      {articles.map((a) => (
        <StoryCard key={a.slug} article={a} locale={locale} />
      ))}
    </div>
  );
}
