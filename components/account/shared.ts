"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type TabId =
  | "overview" | "profile" | "saved" | "following" | "history"
  | "notifications" | "membership" | "security" | "preferences" | "privacy";

export interface AccountUser {
  name: string | null;
  email: string;
  role?: string;
  membership: string; // e.g. "reader"
  createdAt?: string | null;
  emailVerified?: boolean;
  provider?: string | null; // "credentials" | "google" | …
  renewsAt?: string | null;
  status?: string | null;
}

export const isPaid = (m: string) => !["reader", "free", ""].includes(m.toLowerCase());

export function initialsOf(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  const out = parts.length > 1 ? parts[0][0] + parts[1][0] : Array.from(src).slice(0, 2).join("");
  return out.toUpperCase();
}

export const fmtDate = (iso?: string | null, locale = "en") =>
  iso ? new Date(iso).toLocaleDateString(locale === "am" ? "am-ET" : "en-US", { year: "numeric", month: "short", day: "numeric" }) : "";

// ---------- tiny fetch wrapper ----------
export type ApiResult<T> = { ok: boolean; status: number; data: T | null; error?: string };

export async function api<T = unknown>(
  url: string,
  init: { method?: string; json?: unknown } = {},
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: init.method ?? "GET",
      headers: init.json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
    });
    let data: unknown = null;
    try {
      data = await res.json();
    } catch {}
    const error = res.ok
      ? undefined
      : ((data as { error?: string } | null)?.error ?? res.statusText ?? "Request failed");
    return { ok: res.ok, status: res.status, data: data as T | null, error };
  } catch {
    return { ok: false, status: 0, data: null, error: "Network error — please try again." };
  }
}
/** An endpoint that doesn't exist yet. The UI degrades gracefully instead of breaking. */
export const isMissing = (r: { status: number }) => r.status === 404 || r.status === 405;

const LS = "aksum-acct:";
export const LOCAL_PREFIX = LS;

/**
 * Settings object synced with GET/PUT {url}. If the endpoint doesn't exist yet,
 * it falls back to localStorage (and says so via `local`), so every control works today.
 */
export function useSynced<T extends object>(key: string, url: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    let live = true;
    (async () => {
      const r = await api<T>(url);
      if (!live) return;
      if (r.ok && r.data && typeof r.data === "object") {
        setValue({ ...initialRef.current, ...r.data });
      } else if (isMissing(r)) {
        setLocal(true);
        try {
          const raw = localStorage.getItem(LS + key);
          if (raw) setValue({ ...initialRef.current, ...JSON.parse(raw) });
        } catch {}
      }
      setLoading(false);
    })();
    return () => {
      live = false;
    };
  }, [key, url]);

  const save = useCallback(
    async (next: T) => {
      setValue(next);
      const toLocal = () => {
        try {
          localStorage.setItem(LS + key, JSON.stringify(next));
        } catch {}
        setLocal(true);
        return true;
      };
      if (local) return toLocal();
      const r = await api(url, { method: "PUT", json: next });
      if (isMissing(r)) return toLocal();
      return r.ok;
    },
    [key, url, local],
  );

  return { value, save, loading, local };
}

/** A list from GET {url} → { items: [] } | []. */
export function useList<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  const run = useCallback(async () => {
    const r = await api<{ items?: T[] } | T[]>(url);
    if (isMissing(r)) return setState("missing");
    if (!r.ok) return setState("error");
    const d = r.data;
    setItems(Array.isArray(d) ? d : (d?.items ?? []));
    setState("ready");
  }, [url]);

  useEffect(() => {
    void run();
  }, [run]);

  const reload = useCallback(() => {
    setState("loading");
    void run();
  }, [run]);

  return { items, setItems, state, reload };
}
