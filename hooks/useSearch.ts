"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/content/types/Article";

export function useSearch(query: string) {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 250); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, loading };
}