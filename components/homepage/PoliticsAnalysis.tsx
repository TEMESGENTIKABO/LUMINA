import "./home.css";
import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { StoryCard } from "./StoryCard";
import type { Article } from "@/content/types/Article";

export function PoliticsAnalysis({
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
          kicker="Understand the story"
          title="Politics Analysis"
          href="/news/politics"
          locale={locale}
        />
        <div className="hp-grid c3">
          {articles.map((a) => (
            <div key={a.slug}>
              <StoryCard article={a} locale={locale} />
              <Link
                href={`/${locale}/author/${a.author.slug}`}
                className="hp-by"
              >
                By {a.author.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
