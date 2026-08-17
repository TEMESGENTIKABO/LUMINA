"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

export function SearchOverlay({
  locale,
  onClose,
}: {
  locale: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const { results, loading } = useSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] bg-parchment-white flex flex-col">
      <div className="max-w-page mx-auto w-full px-6 pt-6 flex items-center gap-4">
        <SearchIcon className="text-obsidian-grey flex-shrink-0" size={20} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AKSUM…"
          className="flex-1 bg-transparent font-headline-en text-2xl outline-none placeholder:text-obsidian-grey/40"
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          className="text-obsidian-grey hover:text-aksum-black"
        >
          <X size={22} />
        </button>
      </div>

      <div className="max-w-page mx-auto w-full px-6 mt-8 flex-1 overflow-y-auto">
        {loading && (
          <p className="font-ui text-sm text-obsidian-grey">Searching…</p>
        )}

        {!loading && query.trim() && results.length === 0 && (
          <p className="font-ui text-sm text-obsidian-grey">
            No results for &quot;{query}&quot;.
          </p>
        )}

        <ul className="flex flex-col divide-y divide-obsidian-grey/10">
          {results.map((article) => (
            <li key={article.slug} className="py-4">
              <Link
                href={`/${locale}/article/${article.slug}`}
                onClick={onClose}
                className="group flex items-center justify-between gap-6"
              >
                <div>
                  <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey uppercase tracking-wide">
                    {article.subcategory ?? article.category}
                  </p>
                  <h3 className="font-headline-en text-[length:var(--text-headline-md)] group-hover:text-manuscript-red transition-colors">
                    {article.title_en}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
