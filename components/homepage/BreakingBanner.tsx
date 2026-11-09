"use client";

import "./home.css";
import "./home-upgrade.css";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Pause, Play, X, Zap } from "lucide-react";
import { getHomeLabels, pickText, textLang } from "@/lib/homeLabels";
import type { Article } from "@/content/types/Article";

const KEY = "aksum-breaking-dismissed";

const subscribeToDismissal = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getDismissedSignature = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const getServerDismissedSignature = () => null;

export function BreakingBanner({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const L = getHomeLabels(locale);
  const breaking = articles.filter((a) => a.isBreaking).slice(0, 6);
  // A dismissal only covers THIS set of headlines; new breaking news reappears.
  const signature = breaking.map((a) => a.slug).join("|");

  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  const dismissedSignature = useSyncExternalStore(
    subscribeToDismissal,
    getDismissedSignature,
    getServerDismissedSignature,
  );

  if (dismissed || dismissedSignature === signature || breaking.length === 0) return null;

  const scrolls = breaking.length > 1;
  const link = (a: Article, extra?: { hidden?: boolean }) => (
    <Link
      key={`${a.slug}${extra?.hidden ? "-dup" : ""}`}
      href={`/${locale}/article/${a.slug}`}
      lang={textLang(a.title_am, locale)}
      tabIndex={extra?.hidden ? -1 : undefined}
      aria-hidden={extra?.hidden || undefined}
      style={{ fontSize: 14 }}
    >
      {pickText(a.title_en, a.title_am, locale)}
    </Link>
  );

  return (
    <section className="hp-banner" aria-label={L.breakingNews}>
      <div className="hp-w">
        <span className="hp-pill2">
          <Zap size={13} aria-hidden /> {L.breaking}
        </span>

        {scrolls ? (
          <div className="hp-tick">
            <div
              className="hp-track"
              style={{
                animationDuration: `${Math.max(24, breaking.length * 14)}s`,
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {breaking.map((a) => link(a))}
              {breaking.map((a) => link(a, { hidden: true }))}
            </div>
          </div>
        ) : (
          <div className="hp-single">{link(breaking[0])}</div>
        )}

        {scrolls && (
          <button
            type="button"
            className="hp-bannerbtn"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? L.playTicker : L.pauseTicker}
            aria-pressed={paused}
          >
            {paused ? (
              <Play size={14} aria-hidden />
            ) : (
              <Pause size={14} aria-hidden />
            )}
          </button>
        )}
        <button
          type="button"
          className="hp-bannerbtn"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(KEY, signature);
            } catch {}
          }}
          aria-label={L.dismiss}
        >
          <X size={15} aria-hidden />
        </button>
      </div>
    </section>
  );
}
