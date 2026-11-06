"use client";

import "@/components/homepage/home.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { categoryTone } from "@/lib/categoryTone";
import { getLabels } from "@/lib/labels";

const RECENT_KEY = "aksum-recent-searches";

export function SearchOverlay({
  locale,
  onClose,
}: {
  locale: string;
  onClose: () => void;
}) {
  const L = getLabels(locale);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const { results, loading } = useSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const recentTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
        if (Array.isArray(stored)) {
          setRecent(stored.filter((item): item is string => typeof item === "string"));
        }
      } catch {}
    }, 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(recentTimer);
      document.body.style.overflow = prev;
    };
  }, []);
  function remember(q: string) {
    const t = q.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  }
  function openArticle(slug: string) {
    remember(query);
    onClose();
    router.push(`/${locale}/article/${slug}`);
  }
  function seeAll() {
    remember(query);
    onClose();
    router.push(`/${locale}/search-results?q=${encodeURIComponent(query)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[active]) openArticle(results[active].slug);
      else if (query.trim()) seeAll();
    }
  }

  return (
    <div
      className="hp fixed inset-0 z-[70] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={L.search}
      onKeyDown={onKeyDown}
    >
      <div
        className="hp-w flex w-full items-center gap-4"
        style={{
          paddingTop: 24,
          paddingBottom: 16,
          borderBottom: "1px solid var(--hp-line)",
        }}
      >
        <SearchIcon
          size={22}
          style={{ color: "var(--hp-mut)", flex: "none" }}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder={L.searchPlaceholder}
          aria-label={L.search}
          className="hp-serif flex-1 bg-transparent outline-none"
          style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--hp-fg)" }}
        />
        <button
          onClick={onClose}
          aria-label="Close"
          className="hp-ib"
          style={{
            display: "grid",
            placeItems: "center",
            width: 44,
            height: 44,
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div
        className="hp-w w-full flex-1 overflow-y-auto"
        style={{ paddingTop: 20, paddingBottom: 40 }}
      >
        {!query.trim() && recent.length > 0 && (
          <div>
            <p className="hp-lab" style={{ marginBottom: 12 }}>
              {L.recent}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {recent.map((r) => (
                <button
                  key={r}
                  className="hp-tchip"
                  onClick={() => {
                    setQuery(r);
                    setActive(0);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p style={{ color: "var(--hp-mut)" }}>…</p>}
        {!loading && query.trim() && results.length === 0 && (
          <p style={{ color: "var(--hp-mut)" }}>
            {L.noResults} “{query}”
          </p>
        )}

        <ul role="listbox" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {results.map((a, n) => {
            const cat = a.subcategory ?? a.category;
            const tone = categoryTone(cat);
            return (
              <li key={a.slug} role="option" aria-selected={n === active}>
                <button
                  onClick={() => openArticle(a.slug)}
                  onMouseEnter={() => setActive(n)}
                  className="hp-row"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background:
                      n === active ? "rgba(128,128,128,.12)" : undefined,
                    margin: 0,
                  }}
                >
                  <div
                    className="hp-im"
                    style={{ width: 88, aspectRatio: "4/3" }}
                  >
                    <Image src={a.heroImageUrl} alt="" fill sizes="96px" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span
                      className="hp-chip"
                      style={{ margin: 0, background: tone.bg, color: tone.fg }}
                    >
                      {cat}
                    </span>
                    <h3 style={{ marginTop: 6 }}>
                      {locale === "am" && a.title_am ? a.title_am : a.title_en}
                    </h3>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {results.length > 0 && (
          <button onClick={seeAll} className="hp-va" style={{ marginTop: 20 }}>
            {L.seeAll} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
