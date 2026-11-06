import "./article-modern.css";
import { categoryTone } from "@/lib/categoryTone";

export function ArticleHeader({
  category,
  title,
  dek,
}: {
  category: string;
  accentColor?: string; // kept so existing callers still compile
  title: string;
  dek: string;
}) {
  const tone = categoryTone(category);
  return (
    <header className="art-col" style={{ paddingTop: 40 }}>
      <span
        className="art-kicker"
        style={{ background: tone.bg, color: tone.fg }}
      >
        {category}
      </span>
      <h1 className="art-title hp-serif">{title}</h1>
      <p className="art-dek">{dek}</p>
    </header>
  );
}
