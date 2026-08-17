import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
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
  return (
    <li>
      <Link
        href={`/${locale}/article/${article.slug}`}
        className="group flex items-center gap-4 py-3.5 -mx-3 px-3 rounded-sm transition-colors duration-200 hover:bg-obsidian-grey/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold"
      >
        <div className="relative w-25 h-25 flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
          <Image
            src={article.heroImageUrl}
            alt={article.title_en}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          {isLatest && (
            <span className="absolute top-1 left-1 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-manuscript-red opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-manuscript-red" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-body-en text-[length:var(--text-body)] leading-snug transition-colors duration-200 group-hover:text-manuscript-red">
            {article.title_en}
          </h3>
          <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/50 tabular-nums mt-1 inline-block">
            {formatTime(article.publishedAt)}
          </span>
        </div>
      </Link>
    </li>
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
  const columnOne = visible.slice(0, mid);
  const columnTwo = visible.slice(mid);

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <div className="flex items-center justify-between">
        <SectionHeader label="Latest News" />
        {articles.length > limit && (
          <Link
            href={`/${locale}${viewAllHref}`}
            className="font-ui text-xs text-obsidian-grey/60 hover:text-manuscript-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold rounded-sm whitespace-nowrap"
          >
            view all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-hairline">
        <ul className="divide-y divide-hairline sm:pr-8">
          {columnOne.map((article, i) => (
            <NewsItem
              key={article.slug}
              article={article}
              isLatest={i === 0}
              locale={locale}
            />
          ))}
        </ul>
        <ul className="divide-y divide-hairline sm:pl-8">
          {columnTwo.map((article) => (
            <NewsItem
              key={article.slug}
              article={article}
              isLatest={false}
              locale={locale}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
