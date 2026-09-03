"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { primaryNav } from "@/config/navigation";

export function PrimaryNav({ locale, activeSlug }: { locale: string; activeSlug?: string }) {
  const t = useTranslations();

  return (
    <nav className="flex items-center justify-center gap-8 h-11 overflow-x-auto">
      {primaryNav.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <div key={item.slug} className="group relative h-full flex items-center">
            <Link
              href={`/${locale}/${item.slug}`}
              className={`section-label whitespace-nowrap ${isActive ? "text-manuscript-red" : "text-obsidian-grey hover:text-aksum-black"}`}
            >
              {t(item.labelKey)}
            </Link>

            {item.subItems && (
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-parchment-white hairline-y border-l border-r border-hairline min-w-[190px] z-50">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.path}
                    href={`/${locale}/${sub.path}`}
                    className="px-4 py-2.5 font-ui text-sm text-obsidian-grey hover:text-aksum-black hover:bg-obsidian-grey/[0.03] hairline-b last:border-b-0"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
