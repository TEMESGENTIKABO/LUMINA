"use client";

import "./hero.css";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/content/types/Article";

const MAX_SLIDES = 3;
const AUTOPLAY_MS = 7000;

const T = {
  en: {
    topStory: "Top Story",
    breaking: "Breaking",
    read: "Read Full Story",
    min: "min read",
    kicker: "Ethiopia",
    tagline: ["Rooted in Heritage", "Building Tomorrow"],
    prev: "Previous story",
    next: "Next story",
    goTo: "Go to story",
  },
  am: {
    topStory: "ዋና ዜና",
    breaking: "አስቸኳይ",
    read: "ሙሉውን ያንብቡ",
    min: "ደቂቃ ንባብ",
    kicker: "ኢትዮጵያ",
    tagline: ["በቅርስ ላይ የጸና", "ነገን የሚገነባ"],
    prev: "ቀዳሚ ዜና",
    next: "ቀጣይ ዜና",
    goTo: "ወደ ዜና",
  },
} as const;

/* ---------- inline icons ---------- */
const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
    <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 1.8" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);
const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
  </svg>
);
/* Gold ring + rosette (swap for the real AKSUM category mark if you have it) */
const Emblem = () => (
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <circle cx="16" cy="16" r="14.2" />
    <circle cx="16" cy="16" r="10.6" opacity=".55" />
    <path d="M16 7.5c2.2 2.4 2.2 5.2 0 7.6-2.2-2.4-2.2-5.2 0-7.6ZM16 16.9c2.2 2.4 2.2 5.2 0 7.6-2.2-2.4-2.2-5.2 0-7.6ZM7.5 16c2.4-2.2 5.2-2.2 7.6 0-2.4 2.2-5.2 2.2-7.6 0ZM16.9 16c2.4-2.2 5.2-2.2 7.6 0-2.4 2.2-5.2 2.2-7.6 0Z" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export function Hero({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const slides = articles.slice(0, MAX_SLIDES);
  const count = slides.length;
  const am = locale === "am";
  const t = am ? T.am : T.en;

  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (n: number) => setI(((n % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, paused, i]);

  if (!count) return null;

  const title = (a: Article) => (am && a.title_am ? a.title_am : a.title_en);
  const dek = (a: Article) => (am && a.dek_am ? a.dek_am : a.dek_en);

  return (
    <section
      className="hx"
      aria-roledescription="carousel"
      aria-label={t.topStory}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? i + 1 : i - 1);
      }}
    >
      {/* Photo layers */}
      {slides.map((a, n) => (
        <div
          key={a.slug}
          className={`hx-bg${n === i ? " is-active" : ""}`}
          aria-hidden
        >
          <Image
            src={a.heroImageUrl}
            alt=""
            fill
            priority={n === 0}
            quality={85}
            sizes="100vw"
            className="hx-img"
          />
        </div>
      ))}
      <div className="hx-shade" aria-hidden />
      <div className="hx-glow" aria-hidden />

      {/* Copy */}
      {slides.map((a, n) => (
        <div
          key={a.slug}
          className={`hx-slide${n === i ? " is-active" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${n + 1} / ${count}`}
          aria-hidden={n !== i}
        >
          <div className="hx-copy">
            <span className="hx-chip">
              <StarIcon />
              {a.isBreaking ? t.breaking : t.topStory}
            </span>

            <h1 className="hx-title">{title(a)}</h1>
            <p className="hx-dek">{dek(a)}</p>

            <div className="hx-row">
              <span className="hx-cat">
                <Emblem />
                {a.subcategory ?? a.category}
              </span>
              <span className="hx-time">
                <ClockIcon />
                {a.readTimeMinutes} {t.min}
              </span>
              <Link
                href={`/${locale}/article/${a.slug}`}
                className="hx-btn"
                tabIndex={n === i ? 0 : -1}
              >
                {t.read}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Top-right tagline */}
      <div className="hx-tag">
        <span className="hx-tag-k">
          <i aria-hidden />
          {t.kicker}
        </span>
        <p>
          {t.tagline[0]}
          <br />
          {t.tagline[1]}
        </p>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="hx-ctrl">
          <button type="button" className="hx-arrow" aria-label={t.prev} onClick={() => go(i - 1)}>
            <Chevron dir="left" />
          </button>
          <div className="hx-dots" role="tablist">
            {slides.map((a, n) => (
              <button
                key={a.slug}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={`${t.goTo} ${n + 1}`}
                className={n === i ? "is-active" : ""}
                onClick={() => go(n)}
              />
            ))}
          </div>
          <button type="button" className="hx-arrow" aria-label={t.next} onClick={() => go(i + 1)}>
            <Chevron dir="right" />
          </button>
        </div>
      )}
    </section>
  );
}
