import "./home.css";
import Link from "next/link";

interface FeaturedTopic {
  slug: string;
  title: string;
  count: number;
}

export function FeaturedTopicsRail({
  topics,
  locale,
}: {
  topics: FeaturedTopic[];
  locale: string;
}) {
  if (topics.length === 0) return null;

  return (
    <div className="hp-w">
      <div className="hp-topics">
        <span className="hp-lab">Following the story</span>
        {topics.map((t) => (
          <Link
            key={t.slug}
            href={`/${locale}/topics/${t.slug}`}
            className="hp-tchip"
          >
            {t.title}
            <span>{t.count}</span>
          </Link>
        ))}
        <Link
          href={`/${locale}/topics`}
          className="hp-lab"
          style={{ flex: "none", marginLeft: 4 }}
        >
          All topics →
        </Link>
      </div>
    </div>
  );
}
