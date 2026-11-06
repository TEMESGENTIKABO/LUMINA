import "./hero.css";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function InFocusBand({
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
    <section className="if">
      <div className="hh-w">
        <div className="if-panel">
          <div className="if-lead">
            <h2 className="hp-serif">
              {L.inFocus}
              <i />
            </h2>
            <p>{L.inFocusText}</p>
            <Link href={`/${locale}/video-podcast`} className="if-watch">
              <span>
                <Play size={14} fill="currentColor" />
              </span>{" "}
              {L.watchLatest}
            </Link>
          </div>
          <div className="if-cards">
            {items.map((a) => (
              <Link
                key={a.slug}
                href={`/${locale}/article/${a.slug}`}
                className="ic"
              >
                <div className="ic-im">
                  <Image
                    src={a.heroImageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1100px) 15vw, 50vw"
                  />
                </div>
                <div className="ic-body">
                  <b>{a.subcategory ?? a.category}</b>
                  <h4>{am && a.title_am ? a.title_am : a.title_en}</h4>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
