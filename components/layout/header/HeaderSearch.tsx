"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  CornerDownLeft,
  Search,
  X,
} from "lucide-react";
import { hdLabels } from "./utils";

const KEY = "aksum-recent-searches";

function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string").slice(0, 6)
      : [];
  } catch {
    return [];
  }
}
function writeRecent(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

interface Row {
  id: string;
  label: string;
  href?: string; // no href = "run a search for what I typed"
}

export function HeaderSearch({
  locale,
  topics,
  onClose,
}: {
  locale: string;
  topics: { label: string; href: string }[];
  onClose: () => void;
}) {
  const router = useRouter();
  const L = hdLabels(locale);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>(readRecent);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dlgRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setClosing(true);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.setTimeout(onClose, reduce ? 0 : 180);
  }, [onClose]);

  // Focus the field, trap Tab, close on Escape, hand focus back on unmount.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dlgRef.current) return;
      const f = Array.from(
        dlgRef.current.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled]),input",
        ),
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [close]);

  // While typing: "Search for …" first, then sections that match, so
  // "pol" + Enter-on-second-row jumps straight to Politics.
  const term = q.trim();
  const needle = term.toLowerCase();
  const rows: Row[] = term
    ? [
        { id: "hd-r-0", label: L.searchFor(term) },
        ...topics
          .filter((t) => t.label.toLowerCase().includes(needle))
          .slice(0, 5)
          .map((t, n) => ({
            id: `hd-r-${n + 1}`,
            label: t.label,
            href: t.href,
          })),
      ]
    : [];
  const cur = Math.min(active, Math.max(rows.length - 1, 0));

  useEffect(() => {
    document
      .getElementById(`hd-r-${cur}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cur, rows.length]);

  function go(text: string) {
    const t = text.trim();
    if (!t) return;
    const next = [
      t,
      ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase()),
    ].slice(0, 6);
    writeRecent(next);
    // NOTE: assumes your search page reads ?q= — adjust if it uses another name.
    router.push(`/${locale}/search?q=${encodeURIComponent(t)}`);
    close();
  }

  function choose(row: Row | undefined) {
    if (row?.href) {
      router.push(row.href);
      close();
    } else {
      go(q);
    }
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!rows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((cur + 1) % rows.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((cur - 1 + rows.length) % rows.length);
    }
  }

  return (
    <div className={`hd-search ${closing ? "closing" : ""}`}>
      <div className="hd-sback" onClick={close} />
      <div
        ref={dlgRef}
        className="hd-sdlg"
        role="dialog"
        aria-modal="true"
        aria-label={L.search}
      >
        <form
          className="hd-sform"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            choose(rows[cur]);
          }}
        >
          <Search size={20} className="hd-sico" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls="hd-sres"
            aria-autocomplete="list"
            aria-activedescendant={rows.length ? rows[cur].id : undefined}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder={L.searchPh}
            aria-label={L.search}
            enterKeyHint="search"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {q && (
            <button
              type="button"
              className="hd-ib hd-sclear"
              aria-label={L.clear}
              onClick={() => {
                setQ("");
                setActive(0);
                inputRef.current?.focus();
              }}
            >
              <X size={18} />
            </button>
          )}
          <button type="submit" className="hd-sgo" disabled={!term}>
            <span>{L.search}</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="hd-scancel"
            onClick={close}
            aria-label={L.close}
          >
            <span className="hd-cancel">{L.close}</span>
            <kbd className="hd-esc">Esc</kbd>
          </button>
        </form>

        <div className="hd-sbody">
          {term ? (
            <ul
              id="hd-sres"
              role="listbox"
              aria-label={L.search}
              className="hd-sres"
            >
              {rows.map((r, n) => (
                <li
                  key={r.id}
                  id={r.id}
                  role="option"
                  aria-selected={n === cur}
                  className={`hd-sr ${n === cur ? "on" : ""}`}
                  onMouseMove={() => setActive(n)}
                  onClick={() => choose(r)}
                >
                  {r.href ? (
                    <ArrowUpRight size={16} aria-hidden="true" />
                  ) : (
                    <Search size={16} aria-hidden="true" />
                  )}
                  <span className="hd-srl">{r.label}</span>
                  {r.href && <small>{L.jumpTo}</small>}
                  {n === cur && (
                    <CornerDownLeft
                      size={14}
                      className="hd-sret"
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <>
              {recent.length > 0 && (
                <section className="hd-sgrp">
                  <div className="hd-sgh">
                    <h3>{L.recent}</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setRecent([]);
                        writeRecent([]);
                      }}
                    >
                      {L.clear}
                    </button>
                  </div>
                  <ul className="hd-schips">
                    {recent.map((r) => (
                      <li key={r}>
                        <button
                          type="button"
                          className="hd-sc"
                          onClick={() => go(r)}
                        >
                          <Clock size={14} />
                          {r}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              <section className="hd-sgrp">
                <h3>{L.sections}</h3>
                <ul className="hd-schips">
                  {topics.map((t) => (
                    <li key={t.href}>
                      <Link href={t.href} className="hd-sc" onClick={close}>
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
