import "./home.css";
import "./home-next.css";
import Link from "next/link";
import Image from "next/image";
import { getLabels } from "@/lib/labels";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function BusinessInsights({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;
  const [lead, ...rest] = articles;
  const L = getLabels(locale);
  const am = locale === "am";

  return (
    <section className="hp-sec">
        <div className="hp-w">
          <SectionHead
            kicker="Markets"
            title="Business Insights"
            href="/business-tech"
            locale={locale}
          />
          <div className="hn-biz">
            <StoryCard
              article={lead}
              locale={locale}
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="hp-side">
              {rest.slice(0, 3).map((a) => {
                const title = am && a.title_am ? a.title_am : a.title_en;
                return (
                  <Link
                    key={a.slug}
                    href={`/${locale}/article/${a.slug}`}
                    className="hp-row"
                  >
                    <div className="hp-im">
                      <Image src={a.heroImageUrl} alt="" fill sizes="128px" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span className="hp-lab">
                        {a.subcategory ?? a.category}
                      </span>
                      <h3 style={{ marginTop: 4 }}>{title}</h3>
                      <div className="hp-meta">
                        {a.readTimeMinutes} {L.minRead}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
    </section>
  );
}
