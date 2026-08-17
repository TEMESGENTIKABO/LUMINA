import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/content/types/Article";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function Hero({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const [lead, ...companions] = articles.slice(0, 4);
  if (!lead) return null;

  return (
    <section className="max-w-page mx-auto px-6 pt-6">
      {lead.isBreaking && (
        <div className="inline-flex items-center gap-2 bg-manuscript-red text-parchment-white font-ui text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1.5 mb-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-parchment-white opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-parchment-white" />
          </span>
          Breaking
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 hairline-b pb-8">
        <Link
          href={`/${locale}/article/${lead.slug}`}
          className="lg:col-span-3 group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold focus-visible:ring-offset-4"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-obsidian-grey/10">
            <Image
              src={lead.heroImageUrl}
              alt={lead.title_en}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-aksum-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <p className="section-label text-manuscript-red mt-4">
            {lead.subcategory ?? lead.category}
          </p>
          <h1 className="font-headline-en text-[length:var(--text-headline-xl)] leading-[var(--leading-headline)] mt-2 transition-colors duration-200 group-hover:text-manuscript-red">
            {lead.title_en}
          </h1>
          <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey/80 mt-3 max-w-content leading-relaxed">
            {lead.dek_en}
          </p>
        </Link>

        <div className="lg:col-span-2 flex flex-col divide-y divide-hairline">
          {companions.map((article) => (
            <Link
              key={article.slug}
              href={`/${locale}/article/${article.slug}`}
              className="group flex gap-4 py-4 first:pt-0 -mx-2 px-2 rounded-sm transition-colors duration-200 hover:bg-obsidian-grey/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold"
            >
              <div className="relative w-24 aspect-[4/3] flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
                <Image
                  src={article.heroImageUrl}
                  alt={article.title_en}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="section-label truncate"
                  style={{ color: `var(--color-${article.accentColor})` }}
                >
                  {article.subcategory ?? article.category}
                </p>
                <h2 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-1.5 transition-colors duration-200 group-hover:text-manuscript-red">
                  {article.title_en}
                </h2>
                <p className="font-ui text-[length:var(--text-label)] text-obsidian-grey/50 mt-1.5 tabular-nums">
                  {formatTime(article.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
