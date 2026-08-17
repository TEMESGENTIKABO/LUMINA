import Link from "next/link";
import type { Article } from "@/content/types/Article";

export function MostReadRail({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
      <p className="section-label hairline-b pb-2 mb-3">Most Read</p>
      <ol className="divide-y divide-hairline">
        {articles.map((article, i) => (
          <li key={article.slug} className="flex gap-2.5 py-2.5">
            <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/40 tabular-nums pt-0.5 w-4">
              {i + 1}
            </span>
            <Link href={`/${locale}/article/${article.slug}`} className="font-body-en text-[length:var(--text-meta)] leading-snug hover:text-manuscript-red transition-colors">
              {article.title_en}
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
