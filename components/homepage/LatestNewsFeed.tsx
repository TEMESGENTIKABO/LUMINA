import "./home.css";
import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "./SectionHead";
import type { Article } from "@/content/types/Article";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  });
}

function NewsItem({
  article,
  isLatest,
  locale,
}: {
  article: Article;
  isLatest: boolean;
  locale: string;
}) {
  const title =
    locale === "am" && article.title_am ? article.title_am : article.title_en;
  return (
    <Link href={`/${locale}/article/${article.slug}`} className="hp-row">
      <div className="hp-im">
        <Image src={article.heroImageUrl} alt={title} fill sizes="92px" />
        {isLatest && <i className="hp-dot" />}
      </div>
      <div style={{ minWidth: 0 }}>
        <h3>{title}</h3>
        <div className="hp-meta">
          <span>{article.subcategory ?? article.category}</span>
          <time dateTime={article.publishedAt}>
            {formatTime(article.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}

export function LatestNewsFeed({
  articles,
  locale,
  limit = 8,
  viewAllHref = "/news/latest",
}: {
  articles: Article[];
  locale: string;
  limit?: number;
  viewAllHref?: string;
}) {
  const visible = articles.slice(0, limit);
  const mid = Math.ceil(visible.length / 2);

  return (
    <section className="hp-sec">
      <SectionHead
        kicker="Keep up"
        title="More Headlines"
        href={articles.length > limit ? viewAllHref : undefined}
        locale={locale}
      />
      <div className="hp-two">
        <div>
          {visible.slice(0, mid).map((a, i) => (
            <NewsItem
              key={a.slug}
              article={a}
              isLatest={i === 0}
              locale={locale}
            />
          ))}
        </div>
        <div>
          {visible.slice(mid).map((a) => (
            <NewsItem
              key={a.slug}
              article={a}
              isLatest={false}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
