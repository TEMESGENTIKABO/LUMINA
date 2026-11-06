import "@/components/homepage/home.css";
import { SectionHead } from "@/components/homepage/SectionHead";
import { StoryCard } from "@/components/homepage/StoryCard";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function RelatedStoriesEnd({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const unique = articles
    .filter((a, i, all) => i === all.findIndex((x) => x.slug === a.slug))
    .slice(0, 3);
  if (unique.length === 0) return null;
  const L = getLabels(locale);

  return (
    <section className="hp" style={{ marginTop: 56 }}>
      <div className="hp-sec">
        <div className="hp-w">
          <SectionHead kicker={L.related} title={L.keepReading} />
          <div className="hp-grid c3">
            {unique.map((a) => (
              <StoryCard key={a.slug} article={a} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
