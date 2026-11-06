import "./hero.css";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { categoryTone } from "@/lib/categoryTone";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function LatestCards({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const items = articles.slice(0, 5);
  if (items.length === 0) return null;
  const L = getLabels(locale);
  const am = locale === "am";

  return (
    <section className="ln">
      <div className="hh-w">
        <div className="ln-head">
          <span className="ln-bar" />
          <h2 className="ln-title hp-serif">{L.latestNews}</h2>
          <p className="ln-sub">
            {L.latestTagline.map((t, n) => (
              <span key={t}>
                {n > 0 && <s>/</s>}
                <i>{t}</i>
              </span>
            ))}
          </p>
          <Link href={`/${locale}/news/latest`} className="ln-va">
            {L.viewAllNews} <ArrowRight size={15} />
          </Link>
        </div>

        <div className="ln-grid">
          {items.map((a, n) => {
            const cat = a.subcategory ?? a.category;
            const tone = categoryTone(cat);
            const title = am && a.title_am ? a.title_am : a.title_en;
            const dek = am && a.dek_am ? a.dek_am : a.dek_en;
            return (
              <Link
                key={a.slug}
                href={`/${locale}/article/${a.slug}`}
                className="lc"
              >
                <div className="lc-im">
                  <Image
                    src={a.heroImageUrl}
                    alt=""
                    fill
                    sizes={
                      n === 0
                        ? "(min-width: 1100px) 30vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 1100px) 20vw, (min-width: 640px) 50vw, 100vw"
                    }
                  />
                </div>
                <div className="lc-body">
                  <span
                    className="lc-chip"
                    style={
                      { "--c": tone.bg, "--cf": tone.fg } as React.CSSProperties
                    }
                  >
                    {cat}
                  </span>
                  <h3>{title}</h3>
                  <p>{dek}</p>
                  <div className="lc-meta">
                    <span>
                      <MapPin size={12} /> {cat}
                    </span>
                    <span>
                      <Clock size={12} /> {a.readTimeMinutes} {L.minRead}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
