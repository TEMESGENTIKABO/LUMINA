import "./hero.css";
import "./home-next.css";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Newspaper } from "lucide-react";
import { categoryTone } from "@/lib/categoryTone";
import { formatDate } from "@/lib/homeLabels";
import { getLabels } from "@/lib/labels";
import { EmptyState } from "./EmptyState";
import type { Article } from "@/content/types/Article";

export function LatestCards({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const items = articles.slice(0, 5);
  const L = getLabels(locale);
  const am = locale === "am";

  return (
    <section className="ln" aria-labelledby="latest-news-h">
      <div className="hh-w">
        <div className="ln-head">
          <span className="ln-bar" aria-hidden />
          <h2 id="latest-news-h" className="ln-title hp-serif">
            {L.latestNews}
          </h2>
          <p className="ln-sub">
            {L.latestTagline.map((t, n) => (
              <span key={t}>
                {n > 0 && <s>/</s>}
                <i>{t}</i>
              </span>
            ))}
          </p>
          <Link href={`/${locale}/news/latest`} className="ln-va">
            {L.viewAllNews} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Newspaper size={22} />}
            title="No stories yet"
            text="New reporting will appear here as soon as it is published."
          />
        ) : (
          <div
            className={
              items.length === 5 ? "ln-grid ln-grid--bento" : "ln-grid"
            }
          >
            {items.map((a, n) => {
              const cat = a.subcategory ?? a.category;
              const tone = categoryTone(cat);
              const title = am && a.title_am ? a.title_am : a.title_en;
              const dek = am && a.dek_am ? a.dek_am : a.dek_en;
              return (
                <Link
                  key={a.slug}
                  href={`/${locale}/article/${a.slug}`}
                  className={n === 0 ? "lc lc--lead" : "lc"}
                >
                  <div className="lc-im">
                    <Image
                      src={a.heroImageUrl}
                      alt=""
                      fill
                      sizes={
                        n === 0
                          ? "(min-width: 1100px) 50vw, 100vw"
                          : "(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw"
                      }
                    />
                  </div>
                  <div className="lc-body">
                    <span
                      className="lc-chip"
                      style={
                        {
                          "--c": tone.bg,
                          "--cf": tone.fg,
                        } as React.CSSProperties
                      }
                    >
                      {cat}
                    </span>
                    <h3>{title}</h3>
                    {dek && <p>{dek}</p>}
                    <div className="lc-meta">
                      <time dateTime={a.publishedAt}>
                        <Calendar size={12} aria-hidden />{" "}
                        {formatDate(a.publishedAt, locale, {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <span>
                        <Clock size={12} aria-hidden /> {a.readTimeMinutes}{" "}
                        {L.minRead}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
