import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/content/types/Article";

export function ArticleCard({ article, locale }: { article: Article; locale: string }) {
  return (
    <div className="group">
      <Link href={`/${locale}/article/${article.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-obsidian-grey/10">
          <Image src={article.heroImageUrl} alt={article.title_en} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
        </div>
        <p className="section-label mt-2.5" style={{ color: `var(--color-${article.accentColor})` }}>
          {article.subcategory ?? article.category}
        </p>
        <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] mt-1 group-hover:text-manuscript-red transition-colors">
          {article.title_en}
        </h3>
      </Link>
      <p className="font-ui text-[length:var(--text-label)] text-obsidian-grey/60 mt-1.5">
        <Link href={`/${locale}/author/${article.author.slug}`} className="hover:text-aksum-black">
          {article.author.name}
        </Link>
        {" - "}{article.readTimeMinutes} min
      </p>
    </div>
  );
}
