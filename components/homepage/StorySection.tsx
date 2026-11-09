import "./home.css";
import "./home-next.css";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function StorySection({
  articles,
  locale,
  title,
  kicker,
  href,
  columns = 3,
  limit,
  showDek = true,
  soft = false,
}: {
  articles: Article[];
  locale: string;
  title: string;
  kicker?: string;
  href?: string;
  columns?: 3 | 4;
  limit?: number;
  showDek?: boolean;
  soft?: boolean;
}) {
  const items = limit ? articles.slice(0, limit) : articles;
  if (items.length === 0) return null;

  const body = (
    <div className="hp-w">
      <SectionHead kicker={kicker} title={title} href={href} locale={locale} />
      <div className={`hp-grid c${columns}`}>
        {items.map((a) => (
          <StoryCard
            key={a.slug}
            article={a}
            locale={locale}
            showDek={showDek}
            sizes={
              columns === 4
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );

  return soft ? (
    <section className="hp-soft">
      <div className="hp-sec">{body}</div>
    </section>
  ) : (
    <section className="hp-sec">{body}</section>
  );
}
