import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/content/types/Article";

export function InvestigationsFeature({
  article,
  locale,
}: {
  article: Article | null;
  locale: string;
}) {
  if (!article) return null;

  return (
    <section className="bg-aksum-black py-16 mt-8">
      <div className="max-w-page mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-aksum-gold" />
          <p className="section-label text-aksum-gold">Investigations</p>
        </div>

        <Link
          href={`/${locale}/article/${article.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-5 gap-10 items-center focus-visible:outline-none"
        >
          <div className="relative aspect-[16/10] overflow-hidden lg:col-span-2">
            <Image
              src={article.heroImageUrl}
              alt={article.title_en}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-parchment-white/10" />
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-headline-en text-[length:var(--text-headline-lg)] text-parchment-white leading-[var(--leading-headline)] transition-colors duration-300 group-hover:text-aksum-gold">
              {article.title_en}
            </h2>
            <p className="font-body-en text-[length:var(--text-body)] text-parchment-white/60 mt-4 max-w-content leading-relaxed">
              {article.dek_en}
            </p>
            <span className="inline-flex items-center gap-1.5 font-ui text-sm text-aksum-gold mt-6 transition-transform duration-300 group-hover:translate-x-1">
              Read the investigation
              <ArrowUpRight size={15} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
