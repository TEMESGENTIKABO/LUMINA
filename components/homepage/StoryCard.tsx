import "./home.css";
import Link from "next/link";
import Image from "next/image";
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
  const title = am && article.title_am ? article.title_am : article.title_en;
  const dek = am && article.dek_am ? article.dek_am : article.dek_en;

  return (
    <Link href={`/${locale}/article/${article.slug}`} className="hp-card">
      <div className="hp-im">
        <Image src={article.heroImageUrl} alt={title} fill sizes={sizes} />
      </div>
      <span className="hp-chip">{article.subcategory ?? article.category}</span>
      <h3>{title}</h3>
      {showDek && dek && <p className="hp-dek">{dek}</p>}
    </Link>
  );
}
