"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Deliberately loose: accepts label|name|title and href|path|slug so it fits
// whatever getActiveNavContext returns. Tighten it once the shape is final.
export interface SubcategoryItem {
  label?: string;
  name?: string;
  title?: string;
  href?: string;
  path?: string;
  slug?: string;
  active?: boolean;
}

function hrefOf(it: SubcategoryItem, locale?: string) {
  const raw = it.href ?? it.path ?? it.slug ?? "";
  if (raw.startsWith("/") || raw.startsWith("http")) return raw;
  return locale ? `/${locale}/${raw}` : `/${raw}`;
}

export function SubcategoryBar({
  items,
  locale,
}: {
  items: SubcategoryItem[];
  locale?: string;
}) {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);

  // Bring the active chip into view on load (long lists on phones).
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !el) return;
    list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
  }, [pathname]);

  return (
    <nav aria-label="Subcategories">
      <ul
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-6 py-2.5 [mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%-24px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const href = hrefOf(it, locale);
          const label = it.label ?? it.name ?? it.title ?? "";
          const current = it.active ?? pathname === href;
          return (
            <li key={href + label} className="shrink-0">
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-9 items-center rounded-full border px-3.5 font-ui text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-manuscript-red/50 ${
                  current
                    ? "border-aksum-black bg-aksum-black text-parchment-white"
                    : "border-hairline text-obsidian-grey hover:border-aksum-black/40 hover:text-aksum-black"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
