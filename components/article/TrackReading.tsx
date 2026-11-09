"use client";

import { useEffect } from "react";

const HISTORY_KEY = "reading-history";
const HISTORY_MAX = 12;

type Props = {
  id: string;
  slug: string;
  locale: string;
  title: string; // the title in the current locale
  image: string; // heroImageUrl
  category: string;
  dek?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
};

/**
 * Drop this once inside your article page. It saves the story to the browser's
 * reading history so the homepage "Continue Reading" rail has something to show.
 * Most recent first, one entry per article, capped at 12.
 */
export function TrackReading(p: Props) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(prev) ? prev : [];
      const entry = {
        id: p.id,
        slug: p.slug,
        locale: p.locale,
        title: p.title,
        image: p.image,
        category: p.category,
        dek: p.dek,
        readTimeMinutes: p.readTimeMinutes,
        publishedAt: p.publishedAt,
        ts: Date.now(),
      };
      const next = [entry, ...list.filter((e: { slug?: string }) => e?.slug !== p.slug)];
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, HISTORY_MAX)));
    } catch {
      /* private mode / storage full: ignore */
    }
  }, [p.id, p.slug, p.locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
