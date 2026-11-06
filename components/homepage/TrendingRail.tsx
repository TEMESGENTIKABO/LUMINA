import "./home.css";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SectionHead } from "./SectionHead";
import type { TrendingItem } from "@/content/cms/fetchers/getTrending";

const iconMap = { up: TrendingUp, down: TrendingDown, flat: Minus };
const colorMap = { up: "#16a34a", down: "#dc2626", flat: "var(--hp-mut)" };

export function TrendingRail({
  items,
  locale,
}: {
  items: TrendingItem[];
  locale: string;
}) {
  return (
    <aside className="hp-sec hp-trend">
      <SectionHead kicker="Most read" title="Trending" />
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map(({ article, direction }, i) => {
          const Icon = iconMap[direction];
          const title =
            locale === "am" && article.title_am
              ? article.title_am
              : article.title_en;
          return (
            <li key={article.slug} className={i < 3 ? "hp-top3" : undefined}>
              <Link
                href={`/${locale}/article/${article.slug}`}
                className="hp-row"
                style={{ alignItems: "flex-start" }}
              >
                <span className="hp-num">{i + 1}</span>
                <h3 style={{ flex: 1, fontSize: 14.5 }}>{title}</h3>
                <Icon
                  size={13}
                  style={{
                    flex: "none",
                    marginTop: 3,
                    color: colorMap[direction],
                  }}
                />
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
