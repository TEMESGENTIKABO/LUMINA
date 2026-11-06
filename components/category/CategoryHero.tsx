import Link from "next/link";
import Image from "next/image";
import { categoryTone } from "@/lib/categoryTone";
import type { Article } from "@/content/types/Article";

export function CategoryHero({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const [lead, ...rest] = articles.slice(0, 3);
  if (!lead) return null;
  const am = locale === "am";
  const t = (a: Article) => (am && a.title_am ? a.title_am : a.title_en);
  const tone = categoryTone(lead.subcategory ?? lead.category);

  return (
    <div className="hp-hero" style={{ paddingTop: 8 }}>
      <Link
        href={`/${locale}/article/${lead.slug}`}
        className="hp-card hp-lead"
      >
        <div className="hp-im">
          <Image
            src={lead.heroImageUrl}
            alt={t(lead)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>
        <span
          className="hp-chip"
          style={{ background: tone.bg, color: tone.fg }}
        >
          {lead.subcategory ?? lead.category}
        </span>
        <h2
          className="hp-serif"
          style={{
            margin: "12px 0 10px",
            fontSize: "clamp(1.7rem,3.2vw,2.5rem)",
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {t(lead)}
        </h2>
        <p className="hp-dek">
          {am && lead.dek_am ? lead.dek_am : lead.dek_en}
        </p>
      </Link>
      <div className="hp-side">
        {rest.map((a) => (
          <Link
            key={a.slug}
            href={`/${locale}/article/${a.slug}`}
            className="hp-row"
          >
            <div className="hp-im">
              <Image src={a.heroImageUrl} alt={t(a)} fill sizes="128px" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3>{t(a)}</h3>
              <div className="hp-meta">{a.readTimeMinutes} min</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
