"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

interface NavSubItem { label: string; path: string }
interface NavItem { labelKey: string; slug: string; subItems?: NavSubItem[] }

export function MobileNav({
  locale,
  items,
  searchLabel,
}: {
  locale: string;
  items: NavItem[];
  searchLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-obsidian-grey" aria-label="Open menu">
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] bg-parchment-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-14 hairline-b flex-shrink-0">
            <span className="font-headline-en text-xl font-bold">
              <span className="text-manuscript-red">A</span>KSUM
            </span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <Link
              href={`/${locale}/search`}
              onClick={() => setOpen(false)}
              className="font-ui text-sm text-obsidian-grey py-2 block"
            >
              {searchLabel}
            </Link>

            {items.map((item) => (
              <div key={item.slug} className="hairline-b py-3">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="font-headline-en text-lg"
                  >
                    {item.slug}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={() => setExpandedSlug(expandedSlug === item.slug ? null : item.slug)}
                      aria-label="Expand section"
                      className="p-2 text-obsidian-grey"
                    >
                      <ChevronRight size={16} className={expandedSlug === item.slug ? "rotate-90 transition-transform" : "transition-transform"} />
                    </button>
                  )}
                </div>
                {item.subItems && expandedSlug === item.slug && (
                  <div className="flex flex-col gap-1 mt-2 pl-3">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        href={`/${locale}/${sub.path}`}
                        onClick={() => setOpen(false)}
                        className="font-ui text-sm text-obsidian-grey py-1.5"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 flex flex-col gap-1">
              <Link href={`/${locale}/todays-paper`} onClick={() => setOpen(false)} className="font-ui text-sm text-obsidian-grey py-2">Today's Paper</Link>
              <Link href={`/${locale}/topics`} onClick={() => setOpen(false)} className="font-ui text-sm text-obsidian-grey py-2">All Topics</Link>
              <Link href={`/${locale}/events`} onClick={() => setOpen(false)} className="font-ui text-sm text-obsidian-grey py-2">Events</Link>
              <Link href={`/${locale}/membership`} onClick={() => setOpen(false)} className="font-ui text-sm text-aksum-gold py-2">Become a Member</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
