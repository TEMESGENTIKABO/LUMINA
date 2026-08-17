import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/content/types/Article";

export function CategoryHero({ articles, locale }: { articles: Article[]; locale: string }) {
  const [lead, ...rest] = articles.slice(0, 3);
  if (!lead) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 hairline-b pb-6">
      <Link href={`/${locale}/article/${lead.slug}`} className="lg:col-span-2 group block">
        <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-grey/10">
          <Image src={lead.heroImageUrl} alt={lead.title_en} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
        </div>
        <h2 className="font-headline-en text-[length:var(--text-headline-lg)] leading-[var(--leading-headline)] mt-3 group-hover:text-manuscript-red transition-colors">
          {lead.title_en}
        </h2>
        <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-2 max-w-content">{lead.dek_en}</p>
      </Link>

      <div className="flex flex-col divide-y divide-hairline">
        {rest.map((article) => (
          <Link key={article.slug} href={`/${locale}/article/${article.slug}`} className="group flex gap-3 py-3 first:pt-0">
            <div className="relative w-20 aspect-[4/3] flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
              <Image src={article.heroImageUrl} alt={article.title_en} fill sizes="80px" className="object-cover" />
            </div>
            <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] group-hover:text-manuscript-red transition-colors">
              {article.title_en}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
