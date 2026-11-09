import Link from "next/link";
import { headerNav } from "@/config/headerNav";
import { hdLabels, navHref, navLabel } from "./header/utils";

/**
 * Section tabs for the top-level categories. Scrolls sideways on small
 * screens; the active tab is set from `activeSlug` (matches a nav key or path).
 */
export function PrimaryNav({
  locale,
  activeSlug,
}: {
  locale: string;
  activeSlug?: string | null;
}) {
  const L = hdLabels(locale);
  const items = headerNav.filter((i) => i.key !== "home");

  return (
    <nav
      aria-label={L.primary}
      className="border-b border-hairline bg-parchment-white"
    >
      <ul className="max-w-page mx-auto flex gap-1 overflow-x-auto px-6 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active =
            !!activeSlug &&
            (item.key === activeSlug || item.path === activeSlug);
          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={navHref(locale, item.path)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 font-ui text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-manuscript-red/50 ${
                  active
                    ? "bg-aksum-black text-parchment-white"
                    : "text-obsidian-grey hover:bg-aksum-black/5 hover:text-aksum-black"
                }`}
              >
                {navLabel(item, locale, false)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
