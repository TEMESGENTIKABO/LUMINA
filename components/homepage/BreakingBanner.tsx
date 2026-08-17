"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Article } from "@/content/types/Article";

export function BreakingBanner({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const breaking = articles.filter((a) => a.isBreaking).slice(0, 6);

  if (dismissed || breaking.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 bg-aksum-black text-parchment-white">
      <div className="max-w-page mx-auto px-6 flex items-center gap-4">
        <div className="flex items-center gap-2 py-2.5 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-manuscript-red opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-manuscript-red" />
          </span>
          <span className="font-ui text-[11px] font-bold uppercase tracking-[0.08em] text-parchment-white/90">
            Breaking
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2.5 group">
          <div className="flex gap-12 whitespace-nowrap motion-safe:animate-[ticker_28s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {[...breaking, ...breaking].map((article, i) => (
              <Link
                key={`${article.slug}-${i}`}
                href={`/${locale}/article/${article.slug}`}
                className="font-ui text-sm text-parchment-white/85 hover:text-aksum-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold rounded-sm"
                tabIndex={i < breaking.length ? 0 : -1}
              >
                {article.title_en}
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-aksum-black to-transparent" />
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss breaking news banner"
          className="flex-shrink-0 p-1.5 text-parchment-white/50 hover:text-parchment-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold rounded-sm"
        >
          <X size={14} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
