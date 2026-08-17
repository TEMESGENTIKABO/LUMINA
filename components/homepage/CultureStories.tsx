import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

export function CultureStories({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-8 hairline-t">
      <SectionHeader label="Culture" href="/culture" locale={locale} />
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/article/${article.slug}`}
            className="group flex gap-4 py-4 md:py-4 md:px-6 first:pt-0 md:first:pl-0 md:[&:nth-child(2)]:pl-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold rounded-sm"
          >
            <div className="relative w-28 aspect-square flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
              <Image
                src={article.heroImageUrl}
                alt={article.title_en}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            <div className="min-w-0">
              <p
                className="section-label"
                style={{ color: `var(--color-${article.accentColor})` }}
              >
                {article.subcategory ?? article.category}
              </p>
              <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-1.5 transition-colors duration-200 group-hover:text-manuscript-red">
                {article.title_en}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
