"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { useTranslations } from "next-intl";

interface MobileNavItem {
  slug: string;
  labelKey: string;
  subItems?: Array<{ path: string; label: string }>;
}

interface MobileNavProps {
  locale: string;
  items: MobileNavItem[];
  searchLabel: string;
}

export function MobileNav({ locale, items, searchLabel }: MobileNavProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleItem = (slug: string) => {
    setExpandedItem(expandedItem === slug ? null : slug);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-obsidian-grey hover:text-aksum-black transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      <div
        className={`
          fixed inset-0 z-[100] bg-parchment-white transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-hairline">
            <Link
              href={`/${locale}`}
              className="font-headline-en text-2xl font-bold tracking-tight"
              onClick={() => setIsOpen(false)}
            >
              AKSUM
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-obsidian-grey hover:text-aksum-black"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              setSearchOpen(true);
            }}
            className="flex items-center gap-3 px-4 h-14 border-b border-hairline text-obsidian-grey hover:text-aksum-black"
          >
            <Search size={18} />
            <span className="font-ui text-sm">{searchLabel}</span>
          </button>

          <nav
            className="flex-1 overflow-y-auto py-2"
            role="navigation"
            aria-label="Mobile"
          >
            {items.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItem === item.slug;

              return (
                <div key={item.slug} className="border-b border-hairline/50">
                  <div className="flex items-center justify-between px-4">
                    <Link
                      href={`/${locale}/${item.slug}`}
                      className="flex-1 py-3.5 font-headline-en text-lg font-semibold text-aksum-black"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.labelKey)}
                    </Link>
                    {hasSubItems && (
                      <button
                        onClick={() => toggleItem(item.slug)}
                        className="p-2 -mr-2 text-obsidian-grey"
                        aria-expanded={isExpanded}
                        aria-label={`Toggle ${t(item.labelKey)} submenu`}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {hasSubItems && (
                    <div
                      className={`
                        overflow-hidden transition-all duration-200 bg-obsidian-grey/[0.02]
                        ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.path}
                          href={`/${locale}/${sub.path}`}
                          className="block px-6 py-3 font-ui text-sm text-obsidian-grey hover:text-aksum-black border-l-2 border-transparent hover:border-aksum-crimson transition-colors"
                          onClick={() => setIsOpen(false)}
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

          <div className="border-t border-hairline p-4 space-y-3 bg-parchment-white">
            <Link
              href={`/${locale}/membership`}
              className="block w-full py-3 text-center bg-aksum-black text-parchment-white font-ui text-sm font-semibold uppercase tracking-wider hover:bg-aksum-crimson transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Subscribe
            </Link>
            <div className="flex items-center justify-center gap-4 text-sm font-ui text-obsidian-grey">
              <Link
                href={`/${locale}/sign-in`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <span className="text-hairline">|</span>
              <Link
                href={locale === "en" ? "/am" : "/en"}
                onClick={() => setIsOpen(false)}
              >
                {locale === "en" ? "አማርኛ" : "English"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {searchOpen && (
        <SearchOverlay locale={locale} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
