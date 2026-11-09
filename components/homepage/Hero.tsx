"use client";

import "./hero.css";
import "./home-upgrade.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Star,
} from "lucide-react";
import { getHomeLabels, pickText, textLang } from "@/lib/homeLabels";
import type { Article } from "@/content/types/Article";

const SLIDE_MS = 7000;

export function Hero({
  articles,
  locale,
  max = 4,
}: {
  articles: Article[];
  locale: string;
  max?: number;
}) {
  const L = getHomeLabels(locale);
  const slides = articles.slice(0, max);
  const count = slides.length;

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [saver, setSaver] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.saver === "on",
  );
  const [armed, setArmed] = useState(false); // load the other slides' images after first paint
  const root = useRef<HTMLElement>(null);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setArmed(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  // Don't advance slides nobody can see.
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.25,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  const go = useCallback(
    (n: number) => {
      if (count > 0) setCurrent(((n % count) + count) % count);
    },
    [count],
  );

  if (count === 0) return null;

  const i = Math.min(current, count - 1);
  const active = slides[i];
  const paused = userPaused || hovered || focused || !inView;
  const playing = count > 1 && !saver && !paused;
  const kicker = (a: Article) => a.subcategory ?? a.category;

  // The CSS progress animation is the single clock: when it ends, advance.
  const progress = (
    <span
      className="hh-prog"
      aria-hidden
      onAnimationEnd={(e) => {
        if (e.animationName === "hh-fill") go(i + 1);
      }}
    />
  );

  return (
    <section
      ref={root}
      className={`hh${playing ? "" : " is-paused"}${saver ? " is-static" : ""}`}
      style={{ "--hh-ms": `${SLIDE_MS}ms` } as React.CSSProperties}
      aria-roledescription="carousel"
      aria-label={L.topStory}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => {
        setFocused(true);
        setArmed(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? i + 1 : i - 1);
      }}
      onPointerCancel={() => {
        startX.current = null;
      }}
    >
      {slides.map((s, n) => (
        <div
          key={s.slug}
          className={`hh-slide${n === i ? " on" : ""}`}
          aria-hidden
        >
          <div className="hh-img">
            {(n === 0 || n === i || (armed && !saver)) && (
              <Image
                src={s.heroImageUrl}
                alt=""
                fill
                priority={n === 0}
                sizes="100vw"
                quality={75}
              />
            )}
          </div>
        </div>
      ))}
      <div className="hh-shade" aria-hidden />

      <div className="hh-w hh-inner">
        <div
          className="hh-copy"
          key={active.slug}
          aria-live={playing ? "off" : "polite"}
        >
          <span className="hh-pill">
            {active.isBreaking && (
              <Star size={13} fill="currentColor" aria-hidden />
            )}
            {active.isBreaking ? L.breaking : kicker(active)}
          </span>
          <h1
            className="hh-title hp-serif"
            lang={textLang(active.title_am, locale)}
          >
            {pickText(active.title_en, active.title_am, locale)}
          </h1>
          <p className="hh-dek" lang={textLang(active.dek_am, locale)}>
            {pickText(active.dek_en, active.dek_am, locale)}
          </p>
          <div className="hh-meta">
            <Link href={`/${locale}/article/${active.slug}`} className="hh-btn">
              {L.readFull}
              <ArrowRight size={17} aria-hidden />
            </Link>
            <span className="hh-time">
              <Clock size={15} aria-hidden />
              {active.readTimeMinutes} {L.minRead}
            </span>
          </div>
        </div>

        {count > 1 && (
          <ol className="hh-rail" aria-label={L.topStories}>
            {slides.map((s, n) => (
              <li key={s.slug}>
                <button
                  type="button"
                  className="hh-rail-item"
                  aria-current={n === i}
                  onClick={() => go(n)}
                >
                  <span className="hh-rail-cat">{kicker(s)}</span>
                  <span
                    className="hh-rail-title"
                    lang={textLang(s.title_am, locale)}
                  >
                    {pickText(s.title_en, s.title_am, locale)}
                  </span>
                  {n === i && progress}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {count > 1 && (
        <div className="hh-w hh-foot">
          <div className="hh-bars" role="group" aria-label={L.topStories}>
            {slides.map((s, n) => (
              <button
                key={s.slug}
                type="button"
                className="hh-bar"
                aria-label={L.storyOf(n + 1, count)}
                aria-current={n === i}
                onClick={() => go(n)}
              >
                {n === i && progress}
              </button>
            ))}
          </div>
          <span className="hh-count" aria-hidden>
            {i + 1} / {count}
          </span>
          <div className="hh-btns">
            <button
              type="button"
              className="hh-arrow is-step"
              aria-label={L.prev}
              onClick={() => go(i - 1)}
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              className="hh-arrow"
              aria-label={userPaused ? L.play : L.pause}
              aria-pressed={userPaused}
              onClick={() => setUserPaused((v) => !v)}
            >
              {userPaused ? (
                <Play size={17} aria-hidden />
              ) : (
                <Pause size={17} aria-hidden />
              )}
            </button>
            <button
              type="button"
              className="hh-arrow is-step"
              aria-label={L.next}
              onClick={() => go(i + 1)}
            >
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
          <p className="sr-only" aria-live={playing ? "off" : "polite"}>
            {L.storyOf(i + 1, count)}
          </p>
        </div>
      )}
    </section>
  );
}

// Keeps existing `import { HeroCarousel } ...` call sites working.
export { Hero as HeroCarousel };
