import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

export function PoliticsAnalysis({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <SectionHeader
        label="Politics Analysis"
        href="/news/politics"
        locale={locale}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="md:px-6 py-5 md:py-0 first:pt-0 md:first:pl-0"
          >
            <Link
              href={`/${locale}/article/${article.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold rounded-sm"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-obsidian-grey/10 mb-4">
                <Image
                  src={article.heroImageUrl}
                  alt={article.title_en}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] transition-colors duration-200 group-hover:text-manuscript-red">
                {article.title_en}
              </h3>
              <p className="font-body-en text-[length:var(--text-meta)] text-obsidian-grey/75 mt-2 leading-relaxed">
                {article.dek_en}
              </p>
            </Link>
            <Link
              href={`/${locale}/author/${article.author.slug}`}
              className="section-label text-obsidian-grey/50 hover:text-manuscript-red transition-colors duration-200 mt-3 inline-block"
            >
              {article.author.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
