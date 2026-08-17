import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { TrendingItem } from "@/content/cms/fetchers/getTrending";

const iconMap = { up: TrendingUp, down: TrendingDown, flat: Minus };
const colorMap = {
  up: "text-lalibela-blue",
  down: "text-manuscript-red",
  flat: "text-obsidian-grey/40",
};

export function TrendingRail({
  items,
  locale,
}: {
  items: TrendingItem[];
  locale: string;
}) {
  return (
    <aside className="lg:sticky lg:top-6 h-fit">
      <SectionHeader label="Trending" />
      <ol className="divide-y divide-hairline">
        {items.map(({ article, direction }, i) => {
          const Icon = iconMap[direction];
          return (
            <li key={article.slug}>
              <Link
                href={`/${locale}/article/${article.slug}`}
                className="group flex items-center gap-3 py-3 -mx-2 px-2 rounded-sm transition-colors duration-200 hover:bg-obsidian-grey/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold"
              >
                <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/35 tabular-nums flex-shrink-0 w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden bg-obsidian-grey/10">
                  <Image
                    src={article.heroImageUrl}
                    alt={article.title_en}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <span className="font-body-en text-[length:var(--text-meta)] leading-snug flex-1 transition-colors duration-200 group-hover:text-manuscript-red">
                  {article.title_en}
                </span>
                <Icon
                  size={12}
                  className={`flex-shrink-0 self-start mt-1 ${colorMap[direction]}`}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
