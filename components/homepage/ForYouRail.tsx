import "./home.css";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function ForYouRail({
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
        <SectionHead kicker="Based on the topics you follow" title="For You" />
        <div className="hp-grid c3">
          {articles.map((a) => (
            <StoryCard key={a.slug} article={a} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
