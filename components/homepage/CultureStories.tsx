import "./home.css";
import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "./SectionHead";
import type { Article } from "@/content/types/Article";

export function CultureStories({
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
          kicker="Arts & heritage"
          title="Culture"
          href="/culture"
          locale={locale}
        />
        <div className="hp-two">
          {articles.slice(0, 4).map((a) => {
            const title =
              locale === "am" && a.title_am ? a.title_am : a.title_en;
            return (
              <Link
                key={a.slug}
                href={`/${locale}/article/${a.slug}`}
                className="hp-row"
              >
                <div className="hp-im" style={{ width: 112 }}>
                  <Image src={a.heroImageUrl} alt={title} fill sizes="112px" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <span className="hp-lab">{a.subcategory ?? a.category}</span>
                  <h3 style={{ marginTop: 5 }}>{title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
