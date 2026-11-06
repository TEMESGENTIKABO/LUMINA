"use client";

import { useEffect, useState } from "react";
import { ContinueReadingRail } from "./ContinueReadingRail";
import { ForYouRail } from "./ForYouRail";
import type { Article } from "@/content/types/Article";

export function PersonalizedRails({ locale }: { locale: string }) {
  const [data, setData] = useState<{
    forYou: Article[];
    history: Article[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home/personalized")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <>
      <ContinueReadingRail articles={data.history} locale={locale} />
      <ForYouRail articles={data.forYou} locale={locale} />
    </>
  );
}
