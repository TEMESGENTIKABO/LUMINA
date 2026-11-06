import "./home.css";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function EditorsPicksStrip({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="hp-soft">
      <div className="hp-sec">
        <div className="hp-w">
          <SectionHead kicker="Handpicked" title="Editor's Picks" />
          <div className="hp-grid c4">
            {articles.slice(0, 4).map((a) => (
              <StoryCard
                key={a.slug}
                article={a}
                locale={locale}
                showDek={false}
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
