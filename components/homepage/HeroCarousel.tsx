"use client";

import "./hero.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react";
import { Emblem } from "@/components/layout/header/Emblem";
import { getLabels } from "@/lib/labels";
import type { Article } from "@/content/types/Article";

export function HeroCarousel({
  articles,
  locale,
  tagline,
}: {
  articles: Article[];
  locale: string;
  tagline: string;
}) {
  const slides = articles.slice(0, 3);
  const L = getLabels(locale);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [armed, setArmed] = useState(false); // load the other slides' images only after a pause
  const [saver] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.dataset.saver === "on",
  );
  const touchX = useRef<number | null>(null);
  const go = useCallback(
    (n: number) => setI((n + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || saver) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(id);
  }, [slides.length, paused, saver, i]);

  if (slides.length === 0) return null;

  const am = locale === "am";
  const a = slides[i];
  const title = am && a.title_am ? a.title_am : a.title_en;
  const dek = am && a.dek_am ? a.dek_am : a.dek_en;
  const cat = a.subcategory ?? a.category;

  return (
    <section
      className="hh"
      aria-roledescription="carousel"
      aria-label={L.topStory}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const d = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {slides.map((s, n) => (
        <div
          key={s.slug}
          className={`hh-slide ${n === i ? "on" : ""}`}
          aria-hidden={n !== i}
        >
          <div className="hh-img">
            {(n === 0 || n === i || (armed && !saver)) && (
              <Image
                src={s.heroImageUrl}
                alt=""
                fill
                priority={n === 0}
                sizes="100vw"
                quality={70}
              />
            )}
          </div>
          <div className="hh-shade" />
        </div>
      ))}

      <div className="hh-w hh-inner">
        <div
          className="hh-copy"
          key={a.slug}
          aria-live={paused ? "polite" : "off"}
        >
          <span className="hh-pill">
            <Star size={14} fill="currentColor" />{" "}
            {a.isBreaking ? L.breaking : L.topStory}
          </span>
          <h1 className="hh-title hp-serif">{title}</h1>
          <p className="hh-dek">{dek}</p>
          <div className="hh-meta">
            <span className="hh-cat">
              <Emblem /> {cat}
            </span>
            <span className="hh-time">
              <Clock size={15} /> {a.readTimeMinutes} {L.minRead}
            </span>
            <Link href={`/${locale}/article/${a.slug}`} className="hh-btn">
              {L.readFull} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>

      <div className="hh-side" aria-hidden="true">
        <i />
        <b>{cat}</b>
        <em>{tagline}</em>
      </div>

      {slides.length > 1 && (
        <div className="hh-ctrl">
          <button
            className="hh-arrow"
            aria-label="Previous story"
            onClick={() => go(i - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="hh-dots">
            {slides.map((s, n) => (
              <button
                key={s.slug}
                aria-label={`Story ${n + 1}`}
                aria-current={n === i}
                onClick={() => go(n)}
              />
            ))}
          </div>
          <button
            className="hh-arrow"
            aria-label="Next story"
            onClick={() => go(i + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
