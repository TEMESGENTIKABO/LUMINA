"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { primaryNav } from "@/config/navigation";

interface PreviewArticle { slug: string; title_en: string; heroImageUrl: string | null }

export function PrimaryNav({ locale, activeSlug }: { locale: string; activeSlug?: string }) {
  const t = useTranslations();
  const [preview, setPreview] = useState<Record<string, PreviewArticle | null | "loading">>({});

  function handleHover(slug: string) {
    if (preview[slug] !== undefined) return;
    setPreview((prev) => ({ ...prev, [slug]: "loading" }));
    fetch(`/api/nav-preview?category=${slug}`)
      .then((res) => res.json())
      .then((data) => setPreview((prev) => ({ ...prev, [slug]: data.article })));
  }

  return (
    <nav className="flex items-center justify-center gap-8 h-11 overflow-x-auto">
      {primaryNav.map((item) => {
        const isActive = item.slug === activeSlug;
        const p = preview[item.slug];
        return (
          <div key={item.slug} className="group relative h-full flex items-center" onMouseEnter={() => handleHover(item.slug)}>
            <Link
              href={`/${locale}/${item.slug}`}
              className={`section-label whitespace-nowrap ${isActive ? "text-manuscript-red" : "text-obsidian-grey hover:text-aksum-black"}`}
            >
              {t(item.labelKey)}
            </Link>

            {item.subItems && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:flex bg-parchment-white border border-hairline-strong shadow-lg z-50 min-w-[420px]">
                <div className="flex flex-col py-2 min-w-[190px] hairline-y border-r border-hairline">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.path}
                      href={`/${locale}/${sub.path}`}
                      className="px-4 py-2.5 font-ui text-sm text-obsidian-grey hover:text-aksum-black hover:bg-obsidian-grey/[0.03]"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>

                <div className="flex-1 p-4">
                  {p === "loading" || p === undefined ? (
                    <div className="w-full aspect-[16/10] bg-obsidian-grey/5 animate-pulse" />
                  ) : p === null ? (
                    <p className="font-ui text-xs text-obsidian-grey/50">No stories yet in this section.</p>
                  ) : (
                    <Link href={`/${locale}/article/${p.slug}`} className="block group/preview">
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-obsidian-grey/10">
                        {p.heroImageUrl && (
                          <Image src={p.heroImageUrl} alt={p.title_en} fill sizes="220px" className="object-cover" />
                        )}
                      </div>
                      <p className="section-label text-obsidian-grey/50 mt-2">Latest</p>
                      <p className="font-headline-en text-sm leading-tight mt-0.5 group-hover/preview:text-manuscript-red transition-colors">
                        {p.title_en}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
