"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { primaryNav } from "@/config/navigation";

interface PreviewArticle {
  slug: string;
  title_en: string;
  heroImageUrl: string | null;
}
type PreviewState = PreviewArticle[] | "loading";

export function PrimaryNav({
  locale,
  activeSlug,
}: {
  locale: string;
  activeSlug?: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [preview, setPreview] = useState<Record<string, PreviewState>>({});
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function load(slug: string) {
    if (preview[slug] !== undefined) return;
    setPreview((p) => ({ ...p, [slug]: "loading" }));
    fetch(`/api/nav-preview?category=${slug}`)
      .then((r) => r.json())
      .then((d) => setPreview((p) => ({ ...p, [slug]: d.articles ?? [] })))
      .catch(() => setPreview((p) => ({ ...p, [slug]: [] })));
  }

  // Short delay on first open stops the panel flashing as the cursor passes;
  // moving between sections is instant.
  function show(slug: string, delay: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpenSlug(slug);
      load(slug);
    }, delay);
  }
  function hide() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenSlug(null), 140);
  }

  return (
    <nav
      aria-label="Primary"
      className="flex h-full items-stretch"
      onMouseLeave={hide}
    >
      <style>{`@keyframes mega-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}.mega-in{animation:mega-in .18s ease-out}`}</style>

      {primaryNav.map((item) => {
        const label = t(item.labelKey);
        const isActive = item.slug === activeSlug;
        const isOpen = openSlug === item.slug;
        const cards = preview[item.slug];

        return (
          <div
            key={item.slug}
            className="flex"
            onMouseEnter={() => show(item.slug, openSlug ? 0 : 90)}
            onFocus={() => show(item.slug, 0)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null))
                hide();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                clearTimeout(timer.current);
                setOpenSlug(null);
              }
            }}
          >
            <Link
              href={`/${locale}/${item.slug}`}
              aria-haspopup={item.subItems ? "true" : undefined}
              aria-expanded={item.subItems ? isOpen : undefined}
              className={`relative flex items-center px-3.5 font-ui text-[0.92rem] font-semibold whitespace-nowrap transition-colors duration-150 ${
                isActive || isOpen
                  ? "text-white"
                  : "text-white/75 hover:text-white"
              }`}
            >
              {label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3.5 bottom-0 h-[3px] origin-left bg-aksum-gold transition-transform duration-200 ${
                  isActive || isOpen ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>

            {/* Full-width panel, positioned against the dark bar in HeaderShell. */}
            {item.subItems && isOpen && (
              <div className="mega-in absolute inset-x-0 top-full border-b border-obsidian-grey/15 bg-parchment-white text-aksum-black shadow-[0_24px_48px_-12px_rgba(18,16,13,0.28)]">
                <div className="max-w-page mx-auto grid grid-cols-12 gap-10 px-6 py-8">
                  <div className="col-span-3">
                    <p className="section-label text-manuscript-red">Section</p>
                    <Link
                      href={`/${locale}/${item.slug}`}
                      className="mt-2 block font-headline-en text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em]"
                    >
                      {label}
                    </Link>
                    <Link
                      href={`/${locale}/${item.slug}`}
                      className="mt-5 inline-flex items-center gap-2 border-b-2 border-aksum-gold pb-1 font-ui text-[13px] font-bold"
                    >
                      View all {label}
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <ul className="col-span-3 content-start">
                    {item.subItems.map((sub) => (
                      <li
                        key={sub.path}
                        className="border-b border-obsidian-grey/15 first:border-t"
                      >
                        <Link
                          href={`/${locale}/${sub.path}`}
                          className="group flex items-center justify-between py-3 font-ui text-[15px] text-obsidian-grey transition-colors hover:text-aksum-black"
                        >
                          {sub.label}
                          <ArrowRight
                            size={14}
                            className="-translate-x-1 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="col-span-6 grid grid-cols-3 gap-5">
                    {cards === undefined || cards === "loading"
                      ? [0, 1, 2].map((n) => (
                          <div
                            key={n}
                            className="aspect-[4/3] animate-pulse bg-obsidian-grey/10"
                          />
                        ))
                      : cards.map((a) => (
                          <Link
                            key={a.slug}
                            href={`/${locale}/article/${a.slug}`}
                            className="group/card block"
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-grey/10">
                              {a.heroImageUrl && (
                                <Image
                                  src={a.heroImageUrl}
                                  alt={a.title_en}
                                  fill
                                  sizes="220px"
                                  className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
                                />
                              )}
                            </div>
                            <p className="section-label mt-2.5 text-aksum-gold">
                              Latest
                            </p>
                            <p className="mt-1 line-clamp-3 font-headline-en text-[0.97rem] font-semibold leading-snug transition-colors group-hover/card:text-manuscript-red">
                              {a.title_en}
                            </p>
                          </Link>
                        ))}
                    {Array.isArray(cards) && cards.length === 0 && (
                      <p className="col-span-3 font-ui text-sm text-obsidian-grey/60">
                        No stories yet in this section.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
