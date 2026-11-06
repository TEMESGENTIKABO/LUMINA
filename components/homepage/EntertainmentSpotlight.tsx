import "./home.css";
import { Carousel } from "@/components/ui/Carousel";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
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
    <section className="hp-sec">
      <div className="hp-w">
        <SectionHead
          kicker="Screen & stage"
          title="Entertainment Spotlight"
          href="/culture/entertainment"
          locale={locale}
        />
        <Carousel>
          {articles.map((a) => (
            <div key={a.slug} className="flex-shrink-0 w-72">
              <StoryCard article={a} locale={locale} sizes="288px" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
