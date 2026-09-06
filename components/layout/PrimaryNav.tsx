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
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  function handleEnter(slug: string) {
    setOpenSlug(slug);
    if (preview[slug] !== undefined) return;
    setPreview((prev) => ({ ...prev, [slug]: "loading" }));
    fetch(`/api/nav-preview?category=${slug}`)
      .then((res) => res.json())
      .then((data) => setPreview((prev) => ({ ...prev, [slug]: data.article ?? null })))
      .catch(() => setPreview((prev) => ({ ...prev, [slug]: null })));
  }

  return (
    <nav className="flex items-center justify-center gap-8 h-11">
      {primaryNav.map((item, index) => {
        const isActive = item.slug === activeSlug;
        const p = preview[item.slug];
        const isOpen = openSlug === item.slug;
        // Anchor left for the first couple of items (would otherwise clip off
        // the left edge of the viewport), right for the last couple, center otherwise.
        const anchorClass = index <= 1 ? "left-0" : index >= primaryNav.length - 2 ? "right-0" : "left-1/2 -translate-x-1/2";

        return (
          <div
            key={item.slug}
            className="relative h-full flex items-center"
            onMouseEnter={() => handleEnter(item.slug)}
            onMouseLeave={() => setOpenSlug(null)}
          >
            <Link
              href={`/${locale}/${item.slug}`}
              className={`section-label whitespace-nowrap ${isActive ? "text-manuscript-red" : "text-obsidian-grey hover:text-aksum-black"}`}
            >
              {t(item.labelKey)}
            </Link>

            {item.subItems && isOpen && (
              <div className={`absolute ${anchorClass} top-full flex bg-parchment-white border border-hairline-strong shadow-lg z-50 min-w-[420px]`}>
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
