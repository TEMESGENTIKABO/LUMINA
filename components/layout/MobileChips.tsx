"use client";

import { useEffect, useRef } from "react";
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
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeSlug]);

  return (
    <nav
      aria-label="Sections"
      className="relative border-b border-obsidian-grey/15 bg-parchment-white lg:hidden"
    >
      <div className="flex snap-x gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6">
        {items.map((item) => {
          const active = item.slug === activeSlug;
          return (
            <Link
              key={item.slug}
              ref={active ? activeRef : undefined}
              href={`/${locale}/${item.slug}`}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 flex-shrink-0 snap-start items-center rounded-full px-4 font-ui text-[13px] font-semibold transition-all duration-200 active:scale-95 motion-reduce:transition-none ${
                active
                  ? "bg-aksum-black text-parchment-white"
                  : "border border-obsidian-grey/25 text-obsidian-grey hover:border-obsidian-grey/50 hover:text-aksum-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-parchment-white to-transparent"
      />
    </nav>
  );
}
