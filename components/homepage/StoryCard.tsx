import "./home.css";
import "./home-next.css";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/homeLabels";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function StoryCard({
  article,
  locale,
  showDek = true,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  article: Article;
  locale: string;
  showDek?: boolean;
  sizes?: string;
}) {
  const am = locale === "am";
  const L = getLabels(locale);
  const title = am && article.title_am ? article.title_am : article.title_en;
  const dek = am && article.dek_am ? article.dek_am : article.dek_en;

  return (
    <Link href={`/${locale}/article/${article.slug}`} className="hp-card">
      <div className="hp-im">
        {/* Decorative: the heading below already names the story. */}
        <Image src={article.heroImageUrl} alt="" fill sizes={sizes} />
        <span className="hp-chip">
          {article.subcategory ?? article.category}
        </span>
      </div>
      <h3>{title}</h3>
      {showDek && dek && <p className="hp-dek">{dek}</p>}
      <div className="hp-meta">
        <time dateTime={article.publishedAt}>
          {formatDate(article.publishedAt, locale, {
            month: "short",
            day: "numeric",
          })}
        </time>
        <span className="hp-rt">
          <Clock size={12} aria-hidden /> {article.readTimeMinutes} {L.minRead}
        </span>
      </div>
    </Link>
  );
}
