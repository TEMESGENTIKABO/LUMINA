"use client";

import "./home.css";
import { useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
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
    <div className="hp-banner">
      <div className="hp-w">
        <span className="hp-pill2">
          <Zap size={13} /> Breaking
        </span>
        <div className="hp-tick">
          <div className="hp-track">
            {[...breaking, ...breaking].map((a, i) => (
              <Link
                key={`${a.slug}-${i}`}
                href={`/${locale}/article/${a.slug}`}
                tabIndex={i < breaking.length ? 0 : -1}
                style={{ fontSize: 14 }}
              >
                {locale === "am" && a.title_am ? a.title_am : a.title_en}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss breaking news"
          style={{
            flex: "none",
            opacity: 0.6,
            background: "none",
            border: 0,
            color: "inherit",
            cursor: "pointer",
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
