import "./home.css";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function ContinueReadingRail({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="hp-sec">
      <div className="hp-w">
        <SectionHead
          kicker="Pick up where you left off"
          title="Continue Reading"
        />
        <div className="hp-grid c3">
          {articles.map((a) => (
            <StoryCard key={a.slug} article={a} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
