"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActiveNavContext } from "@/lib/getActiveNavContext";

export function MobileChips({
  locale,
  items,
}: {
  locale: string;
  items: { slug: string; label: string }[];
}) {
  const pathname = usePathname();
  const { activeSlug } = getActiveNavContext(pathname, locale);

  return (
    <nav
      aria-label="Sections"
      className="border-b border-obsidian-grey/15 bg-parchment-white lg:hidden"
    >
      <div className="flex gap-2 overflow-x-auto px-6 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <Link
              key={item.slug}
              href={`/${locale}/${item.slug}`}
              aria-current={active ? "page" : undefined}
              className={`flex h-8 flex-shrink-0 items-center rounded-full px-3.5 font-ui text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-aksum-black text-parchment-white"
                  : "border border-obsidian-grey/25 text-obsidian-grey hover:text-aksum-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
