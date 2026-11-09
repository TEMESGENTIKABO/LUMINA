"use client";

import "@/components/homepage/home.css";
import "@/components/homepage/home-upgrade.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { getLabels } from "@/lib/labels";
import { SearchResultGroup, type SearchHit } from "./SearchResultGroup";

const RECENT_KEY = "aksum-recent-searches";
const LIST_ID = "search-listbox";
const OPTION_PREFIX = "search-opt";

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
  const root = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Group by category. `offset` keeps one continuous index for arrow-key navigation.
  const groups = useMemo(() => {
    const map = new Map<string, SearchHit[]>();
    for (const r of results) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    let offset = 0;
    return [...map].map(([category, hits]) => {
      const group = { category, hits, offset };
      offset += hits.length;
      return group;
    });
  }, [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.hits), [groups]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const recentTimer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
        if (Array.isArray(stored)) {
          setRecent(
            stored.filter((item): item is string => typeof item === "string"),
          );
        }
      } catch {}
    }, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(recentTimer);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.(); // give focus back to the search button
    };
  }, []);

  useEffect(() => {
    document
      .getElementById(`${OPTION_PREFIX}-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, flat]);

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
    // Ge'ez keyboards often compose text: Enter/arrows then belong to the IME, not to us.
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Tab") {
      // Keep keyboard focus inside the dialog.
      const nodes = root.current?.querySelectorAll<HTMLElement>(
        'input, button:not([tabindex="-1"]), a[href]',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (flat[active]) openArticle(flat[active].slug);
      else if (query.trim()) seeAll();
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <div
      ref={root}
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
          aria-hidden
          style={{ color: "var(--hp-mut)", flex: "none" }}
        />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={LIST_ID}
          aria-autocomplete="list"
          aria-activedescendant={
            flat.length > 0 ? `${OPTION_PREFIX}-${active}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder={L.searchPlaceholder}
          aria-label={L.search}
          autoComplete="off"
          enterKeyHint="search"
          className="hp-serif flex-1 bg-transparent outline-none"
          style={{ fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--hp-fg)" }}
        />
        <button
          type="button"
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
          <X size={24} aria-hidden />
        </button>
      </div>

      <div
        className="hp-w w-full flex-1 overflow-y-auto"
        style={{ paddingTop: 20, paddingBottom: 40 }}
      >
        {!hasQuery && recent.length > 0 && (
          <div>
            <p className="hp-lab" style={{ marginBottom: 12 }}>
              {L.recent}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {recent.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="hp-tchip"
                  onClick={() => {
                    setQuery(r);
                    setActive(0);
                    inputRef.current?.focus();
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        <p role="status" style={{ margin: 0, color: "var(--hp-mut)" }}>
          {loading
            ? "…"
            : hasQuery && flat.length === 0
              ? `${L.noResults} “${query.trim()}”`
              : ""}
        </p>

        <ul
          id={LIST_ID}
          role="listbox"
          aria-label={L.search}
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {groups.map((g) => (
            <SearchResultGroup
              key={g.category}
              title={g.category}
              hits={g.hits}
              locale={locale}
              query={query}
              offset={g.offset}
              activeIndex={active}
              idPrefix={OPTION_PREFIX}
              onSelect={openArticle}
              onHover={setActive}
            />
          ))}
        </ul>

        {flat.length > 0 && (
          <button
            type="button"
            onClick={seeAll}
            className="hp-va"
            style={{ marginTop: 20 }}
          >
            {L.seeAll} <ArrowRight size={14} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
