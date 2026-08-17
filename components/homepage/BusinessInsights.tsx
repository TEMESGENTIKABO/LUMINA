"use client";

import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

// Deterministic pseudo-data derived from the article slug, so each card's
// sparkline is stable across renders rather than random noise on every load.
// This is illustrative chrome, not real market data - no live financial feed
// is wired up (see Product Specification Section 6, Enterprise Products).
function generateSparkline(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  const points = [];
  let value = 50;
  for (let i = 0; i < 12; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    value += (hash % 21) - 10;
    value = Math.max(10, Math.min(90, value));
    points.push({ i, value });
  }
  return points;
}

export function BusinessInsights({ articles, locale }: { articles: Article[]; locale: string }) {
  if (articles.length === 0) return null;

  return (
    <section className="max-w-page mx-auto px-6 py-6 hairline-t">
      <SectionHeader label="Business Insights" href="/business-tech" locale={locale} />
      <div className="divide-y divide-hairline">
        {articles.slice(0, 3).map((article) => {
          const data = generateSparkline(article.slug);
          const trendUp = data[data.length - 1].value >= data[0].value;
          return (
            <Link key={article.slug} href={`/${locale}/article/${article.slug}`} className="group flex items-center gap-4 py-3">
              <div className="h-10 w-24 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={trendUp ? "var(--color-manuscript-red)" : "var(--color-lalibela-blue)"}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <h3 className="font-headline-en text-[length:var(--text-headline-sm)] leading-[var(--leading-headline)] group-hover:text-manuscript-red transition-colors">
                {article.title_en}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
