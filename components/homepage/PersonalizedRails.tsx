// components/homepage/PersonalizedRails.tsx
"use client";

import { useEffect, useState } from "react";
import { ForYouRail } from "./ForYouRail";
import { ContinueReadingRail } from "./ContinueReadingRail";
import type { Article } from "@/content/types/Article";

const HISTORY_KEY = "reading-history";
const HISTORY_MAX = 6;

type HistoryEntry = {
  id: string;
  slug?: string;
  category?: string;
  title?: string;
  image?: string;
  dek?: string;
  locale?: string;
  ts?: number;
};

type RailsData = {
  forYou: Article[];
  continueReading: Article[];
};

export function PersonalizedRails({ locale }: { locale: string }) {
  const [data, setData] = useState<RailsData>({
    forYou: [],
    continueReading: [],
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const continueReading = await loadContinueReading(locale);
      const forYou = await loadForYou(locale);

      if (!cancelled) {
        setData({ forYou, continueReading });
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (loaded && data.forYou.length === 0 && data.continueReading.length === 0) {
    return null;
  }

  return (
    <>
      {data.continueReading.length > 0 && (
        <ContinueReadingRail articles={data.continueReading} locale={locale} />
      )}
      {data.forYou.length > 0 && (
        <ForYouRail articles={data.forYou} locale={locale} />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

async function loadContinueReading(locale: string): Promise<Article[]> {
  const history = readHistory().filter((e) => !e.locale || e.locale === locale);
  if (history.length === 0) return [];

  const slice = history.slice(0, HISTORY_MAX);

  // If history already stores full article shape, hydrate locally.
  const fullyHydrated = slice.every((e) => e.title && e.slug && e.category);
  if (fullyHydrated) {
    return slice as unknown as Article[];
  }

  // Otherwise batch-hydrate the missing ones from the API.
  const ids = slice.map((e) => e.id).filter(Boolean);
  if (ids.length === 0) return [];

  try {
    const res = await fetch(
      `/api/articles/by-ids?ids=${encodeURIComponent(ids.join(","))}&locale=${locale}`,
      { credentials: "include" },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { articles: Article[] };
    // Preserve most-recent-first order
    const byId = new Map(
      json.articles.map((article) => {
        const id = (article as Article & { id: string }).id;
        return [id, article] as const;
      }),
    );
    return slice.map((e) => byId.get(e.id)).filter(Boolean) as Article[];
  } catch {
    return [];
  }
}

async function loadForYou(locale: string): Promise<Article[]> {
  try {
    const res = await fetch(`/api/personalized?locale=${locale}`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { forYou?: Article[] };
    return json.forYou ?? [];
  } catch {
    return [];
  }
}
