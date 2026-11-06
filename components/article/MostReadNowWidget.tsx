import Link from "next/link";
import type { Article } from "@/content/types/Article";

export function MostReadNowWidget({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <aside className="border border-hairline-strong bg-obsidian-grey/[0.02] p-5">
      <p className="section-label text-manuscript-red flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 bg-manuscript-red rounded-full animate-pulse" />
        Most Read Right Now
      </p>
      <ol className="flex flex-col divide-y divide-hairline">
        {articles.map((article, i) => (
          <li key={article.slug} className="flex gap-2.5 py-2.5 first:pt-0 last:pb-0">
            <span className="font-headline-en text-lg text-obsidian-grey/30 leading-none">{i + 1}</span>
            <Link href={`/${locale}/article/${article.slug}`} className="font-body-en text-sm leading-snug hover:text-manuscript-red transition-colors">
              {article.title_en}
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
