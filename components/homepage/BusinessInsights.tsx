import "./home.css";
import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { Sparkline } from "./Sparkline";
import type { Article } from "@/content/types/Article";

export function BusinessInsights({
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
          kicker="Markets"
          title="Business Insights"
          href="/business-tech"
          locale={locale}
        />
        <div className="hp-panel">
          {articles.slice(0, 3).map((a) => {
            const title =
              locale === "am" && a.title_am ? a.title_am : a.title_en;
            return (
              <Link
                key={a.slug}
                href={`/${locale}/article/${a.slug}`}
                className="hp-r"
              >
                <Sparkline seed={a.slug} />
                <h3>{title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
