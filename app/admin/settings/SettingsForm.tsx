"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  History,
  Loader2,
  MoreHorizontal,
  Palette,
  RotateCcw,
  Save,
  Search,
  Share2,
  Undo2,
  Upload,
  Wand2,
  X,
  type LucideIcon,
} from "lucide-react";
import { updateSiteSettings } from "@/lib/admin/actions/settingsActions";
import { ThemePicker } from "./ThemePicker";
import { ui, tabsCls, tabCls } from "@/components/admin/ui";

interface Settings {
  headerTheme: number;
  siteName: string;
  tagline_en: string;
  tagline_am: string | null;
  defaultSeoDescription: string | null;
  contactEmail: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
}

type Name =
  | "siteName"
  | "tagline_en"
  | "tagline_am"
  | "contactEmail"
  | "defaultSeoDescription"
  | "twitterUrl"
  | "facebookUrl"
  | "instagramUrl"
  | "whatsappUrl"
  | "headerTheme";
type Values = Record<Name, string>;
type TabId = "general" | "seo" | "social" | "appearance";
type Toast = { id: number; kind: "success" | "error" | "info"; msg: string };

const THEME_NAMES = [
  "Premium & Elegant",
  "Modern & Clean",
  "Bold & Dynamic",
  "Minimalist Cream",
  "Vibrant & Trendy",
  "Classic Magazine",
];
const AUTO_KEY = "aksum.settings.autosave";
const DRAFT_KEY = "aksum.settings.draft";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "seo", label: "SEO", icon: Search },
  { id: "social", label: "Social", icon: Share2 },
  { id: "appearance", label: "Appearance", icon: Palette },
];

/* ───────── validation ───────── */
const required = (max: number) => (v: string) =>
  !v.trim()
    ? "This field is required"
    : v.length > max
      ? `Keep it under ${max} characters`
      : null;
const email = (v: string) =>
  !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? null
    : "Enter a valid email address";
const social = (hosts: string[], label: string) => (v: string) => {
  if (!v.trim()) return null;
  let u: URL;
  try {
    u = new URL(v.trim());
  } catch {
    return "Paste the full link, starting with https://";
  }
  if (u.protocol !== "https:" && u.protocol !== "http:")
    return "Link must start with https://";
  const h = u.hostname.replace(/^www\./, "");
  return hosts.some((x) => h === x || h.endsWith(`.${x}`))
    ? null
    : `Should be a ${label} link`;
};

const FIELDS: {
  name: Name;
  label: string;
  tab: TabId;
  validate?: (v: string) => string | null;
}[] = [
  {
    name: "siteName",
    label: "Site name",
    tab: "general",
    validate: required(60),
  },
  {
    name: "tagline_en",
    label: "Tagline (English)",
    tab: "general",
    validate: required(100),
  },
  { name: "tagline_am", label: "Tagline (Amharic)", tab: "general" },
  {
    name: "contactEmail",
    label: "Contact email",
    tab: "general",
    validate: email,
  },
  {
    name: "defaultSeoDescription",
    label: "Default meta description",
    tab: "seo",
    validate: (v) => (v.length > 300 ? "Keep it under 300 characters" : null),
  },
  {
    name: "twitterUrl",
    label: "X / Twitter",
    tab: "social",
    validate: social(["x.com", "twitter.com"], "x.com or twitter.com"),
  },
  {
    name: "facebookUrl",
    label: "Facebook",
    tab: "social",
    validate: social(["facebook.com", "fb.com", "fb.me"], "facebook.com"),
  },
  {
    name: "instagramUrl",
    label: "Instagram",
    tab: "social",
    validate: social(["instagram.com"], "instagram.com"),
  },
  {
    name: "whatsappUrl",
    label: "WhatsApp",
    tab: "social",
    validate: social(["wa.me", "whatsapp.com"], "wa.me or whatsapp.com"),
  },
  { name: "headerTheme", label: "Header theme", tab: "appearance" },
];

/* ───────── helpers ───────── */
const toValues = (s: Settings): Values => ({
  siteName: s.siteName,
  tagline_en: s.tagline_en,
  tagline_am: s.tagline_am ?? "",
  contactEmail: s.contactEmail ?? "",
  defaultSeoDescription: s.defaultSeoDescription ?? "",
  twitterUrl: s.twitterUrl ?? "",
  facebookUrl: s.facebookUrl ?? "",
  instagramUrl: s.instagramUrl ?? "",
  whatsappUrl: s.whatsappUrl ?? "",
  headerTheme: String(s.headerTheme),
});
const toFormData = (v: Values) => {
  const fd = new FormData();
  FIELDS.forEach((f) => fd.set(f.name, v[f.name]));
  return fd;
};
const fmtVal = (name: Name, v: string) =>
  name === "headerTheme"
    ? `${v}. ${THEME_NAMES[Number(v) - 1] ?? ""}`
    : !v.trim()
      ? "(empty)"
      : v.length > 70
        ? `${v.slice(0, 67)}…`
        : v;
const ago = (d: Date, now: number) => {
  const s = Math.max(0, Math.floor((now - d.getTime()) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} h ago`;
};

const pill =
  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-bold";
const menuItem =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition hover:bg-[#f5f2ea]";

/* ═════════════════════════ component ═════════════════════════ */
export function SettingsForm({ initial }: { initial: Settings }) {
  const [values, setValues] = useState<Values>(() => toValues(initial));
  const [baseline, setBaseline] = useState<Values>(() => toValues(initial));
  const [tab, setTab] = useState<TabId>("general");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [touched, setTouched] = useState<Partial<Record<Name, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [auto, setAuto] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<{ values: Values; at: number } | null>(
    null,
  );
  const [themeKey, setThemeKey] = useState(0);
  const [toast, setToast] = useState<Toast | null>(null);

  const valuesRef = useRef(values);
  const baselineRef = useRef(baseline);
  useEffect(() => {
    valuesRef.current = values;
    baselineRef.current = baseline;
  }, [values, baseline]);
  const savingRef = useRef(false);
  const touchedRef = useRef(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const changed = useMemo(
    () => FIELDS.filter((f) => values[f.name] !== baseline[f.name]),
    [values, baseline],
  );
  const errors = useMemo(() => {
    const e: Partial<Record<Name, string>> = {};
    FIELDS.forEach((f) => {
      const m = f.validate?.(values[f.name]);
      if (m) e[f.name] = m;
    });
    return e;
  }, [values]);
  const hasErrors = Object.keys(errors).length > 0;
  const dirty = changed.length > 0;
  const tabCount = (id: TabId) => changed.filter((f) => f.tab === id).length;
  const shownError = (n: Name) =>
    attempted || touched[n] ? errors[n] : undefined;
  const tabHasError = (id: TabId) =>
    FIELDS.some((f) => f.tab === id && shownError(f.name));

  /* ───── actions ───── */
  const notify = useCallback((kind: Toast["kind"], msg: string) => {
    const id = Date.now();
    setToast({ id, kind, msg });
    setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 3500);
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setDraft(null);
  }, []);

  const save = useCallback(
    async (source: "manual" | "auto") => {
      if (savingRef.current) return;
      const snapshot = valuesRef.current;
      if (
        !FIELDS.some((f) => snapshot[f.name] !== baselineRef.current[f.name])
      ) {
        if (source === "manual") notify("info", "No changes to save");
        return;
      }
      const bad = FIELDS.find((f) => f.validate?.(snapshot[f.name]));
      if (bad) {
        if (source === "manual") {
          setAttempted(true);
          setTab(bad.tab);
          notify("error", `Fix “${bad.label}” before saving`);
        }
        return;
      }
      savingRef.current = true;
      setStatus("saving");
      try {
        const res = await updateSiteSettings(toFormData(snapshot));
        if (res && "error" in res && res.error) throw new Error(res.error);
        setBaseline(snapshot); // edits made while saving stay "unsaved"
        setLastSaved(new Date());
        setStatus("idle");
        clearDraft();
        notify("success", source === "auto" ? "Auto-saved" : "Settings saved");
      } catch (err) {
        setStatus("error");
        notify(
          "error",
          err instanceof Error ? err.message : "Couldn't save settings",
        );
      } finally {
        savingRef.current = false;
      }
    },
    [notify, clearDraft],
  );

  const applyValues = (next: Partial<Values>) => {
    touchedRef.current = true;
    setValues((p) => ({ ...p, ...next }));
    if ("headerTheme" in next) setThemeKey((k) => k + 1);
    setStatus((s) => (s === "error" ? "idle" : s));
  };
  const setField = (name: Name, v: string) => {
    touchedRef.current = true;
    setValues((p) => ({ ...p, [name]: v }));
    setStatus((s) => (s === "error" ? "idle" : s));
  };
  const reset = (name: Name) =>
    applyValues({ [name]: baseline[name] } as Partial<Values>);
  const revertAll = () => {
    applyValues(baseline);
    setTouched({});
    setAttempted(false);
    clearDraft();
    setReviewOpen(false);
    setMenuOpen(false);
  };
  const syncTheme = () =>
    requestAnimationFrame(() => {
      const el = themeRef.current?.querySelector<HTMLInputElement>(
        'input[name="headerTheme"]',
      );
      if (el) {
        touchedRef.current = true;
        setValues((p) =>
          p.headerTheme === el.value ? p : { ...p, headerTheme: el.value },
        );
      }
    });
  const toggleAuto = () => {
    const next = !auto;
    setAuto(next);
    try {
      localStorage.setItem(AUTO_KEY, next ? "1" : "0");
    } catch {}
    notify("info", next ? "Auto-save is on" : "Auto-save is off");
  };

  function exportJson() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            app: "aksum-settings",
            version: 1,
            exportedAt: new Date().toISOString(),
            values,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aksum-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMenuOpen(false);
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setMenuOpen(false);
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown>;
      const src = (
        typeof data.values === "object" && data.values ? data.values : data
      ) as Record<string, unknown>;
      const next: Partial<Values> = {};
      for (const f of FIELDS) {
        const v = src[f.name];
        if (typeof v === "string") next[f.name] = v;
        else if (typeof v === "number" && f.name === "headerTheme")
          next[f.name] = String(v);
      }
      const t = Number(next.headerTheme);
      if (next.headerTheme && !(t >= 1 && t <= THEME_NAMES.length))
        delete next.headerTheme;
      const n = Object.keys(next).length;
      if (!n) throw new Error("No recognised settings found in that file");
      applyValues(next);
      notify(
        "info",
        `Imported ${n} setting${n === 1 ? "" : "s"}. Review and save.`,
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error
          ? err.message
          : "That file isn't valid settings JSON",
      );
    }
  }

  /* ───── effects ───── */
  useEffect(() => {
    // hydrate auto-save pref + look for a leftover draft
    const timer = window.setTimeout(() => {
      try {
        setAuto(localStorage.getItem(AUTO_KEY) === "1");
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        const d = JSON.parse(raw) as { values: Values; at: number };
        if (
          FIELDS.some(
            (f) =>
              typeof d.values?.[f.name] === "string" &&
              d.values[f.name] !== baselineRef.current[f.name],
          )
        )
          setDraft(d);
        else localStorage.removeItem(DRAFT_KEY);
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // keep "saved 2 min ago" fresh
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // local draft backup
    if (!touchedRef.current) return;
    try {
      if (dirty)
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ values, at: Date.now() }),
        );
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [values, dirty]);

  useEffect(() => {
    // leave-page guard
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  useEffect(() => {
    // auto-save (debounced, valid only)
    if (!auto || !dirty || hasErrors || status !== "idle") return;
    const t = setTimeout(() => void save("auto"), 2000);
    return () => clearTimeout(t);
  }, [auto, dirty, hasErrors, status, values, save]);

  useEffect(() => {
    // shortcuts
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save("manual");
      }
      if (e.key === "Escape") {
        setReviewOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  useEffect(() => {
    // close tools menu on outside click
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  /* ───── field renderer ───── */
  const field = (
    name: Name,
    o: {
      type?: string;
      placeholder?: string;
      rows?: number;
      hint?: React.ReactNode;
      max?: number;
      link?: boolean;
      action?: React.ReactNode;
    } = {},
  ) => {
    const meta = FIELDS.find((f) => f.name === name)!;
    const v = values[name];
    const err = shownError(name);
    const isChanged = v !== baseline[name];
    const ok = isChanged && !err && v.trim() !== "";
    const cls = `${o.rows ? ui.textarea : ui.input} ${err ? "!border-[#d64545] focus:!ring-[#d64545]/25" : ""} ${o.link ? "pr-10" : ""}`;
    const common = {
      id: name,
      name,
      value: v,
      placeholder: o.placeholder,
      className: cls,
      "aria-invalid": Boolean(err),
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setField(name, e.target.value),
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    };
    return (
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label
            htmlFor={name}
            className="text-xs font-bold tracking-wide text-[#6b665c]"
          >
            {meta.label}
          </label>
          <span className="flex items-center gap-3">
            {o.action}
            {isChanged && (
              <button
                type="button"
                onClick={() => reset(name)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a6414] hover:underline"
              >
                <Undo2 size={11} /> Reset
              </button>
            )}
            {o.max && (
              <span
                className={`text-[11px] font-semibold tabular-nums ${v.length > o.max ? "text-[#b3201f]" : "text-[#a09a8c]"}`}
              >
                {v.length}/{o.max}
              </span>
            )}
          </span>
        </div>
        <div className="relative">
          {o.rows ? (
            <textarea rows={o.rows} {...common} />
          ) : (
            <input type={o.type ?? "text"} {...common} />
          )}
          {o.link && !errors[name] && v.trim() && (
            <a
              href={v.trim()}
              target="_blank"
              rel="noopener noreferrer"
              title="Test link"
              className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-[#6b665c] transition hover:bg-[#f1ede2] hover:text-[#12100d]"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {ok && !o.link && !o.rows && (
            <Check
              size={15}
              className="pointer-events-none absolute right-3 top-[13px] text-[#1f9d6b]"
            />
          )}
        </div>
        {err ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#b3201f]">
            <AlertCircle size={12} />
            {err}
          </p>
        ) : o.hint ? (
          <p className={ui.hint}>{o.hint}</p>
        ) : null}
      </div>
    );
  };

  const show = (id: TabId) => (tab === id ? "" : "hidden");
  const panel = `${ui.card} grid max-w-[860px] gap-5 p-5 md:grid-cols-2`;
  const seoTitle = `${values.siteName || "Site name"}${values.tagline_en ? ` — ${values.tagline_en}` : ""}`;
  const seoDesc =
    values.defaultSeoDescription ||
    "Your default description will appear here.";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save("manual");
      }}
      noValidate
    >
      {/* restore draft */}
      {draft && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e2cf9f] bg-gradient-to-b from-[#fbf6e8] to-white px-4 py-3 text-sm">
          <History size={16} className="text-[#8a6414]" />
          <span className="flex-1">
            You have an unsaved draft from{" "}
            {new Date(draft.at).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
            .
          </span>
          <button
            type="button"
            className={`${ui.btn} !h-8 !px-3 !text-xs`}
            onClick={clearDraft}
          >
            Discard
          </button>
          <button
            type="button"
            className={`${ui.btnPrimary} !h-8 !px-3 !text-xs`}
            onClick={() => {
              applyValues(draft.values);
              setDraft(null);
              notify("info", "Draft restored");
            }}
          >
            Restore draft
          </button>
        </div>
      )}

      {/* toolbar */}
      <div className="sticky top-16 z-30 mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-[#e6e1d6] bg-white/90 p-2 shadow-sm backdrop-blur">
        <div className={tabsCls} role="tablist">
          {TABS.map((t) => {
            const n = tabCount(t.id);
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tabCls(tab === t.id)}
                onClick={() => setTab(t.id)}
              >
                <t.icon size={15} /> {t.label}
                {tabHasError(t.id) ? (
                  <span className="h-2 w-2 rounded-full bg-[#d64545]" />
                ) : (
                  n > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#c79a45] px-1 text-[10px] font-extrabold text-[#1a1405]">
                      {n}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          {/* status pill */}
          {status === "saving" ? (
            <span className={`${pill} bg-[#fbf1d9] text-[#8a6414]`}>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </span>
          ) : status === "error" ? (
            <button
              type="button"
              onClick={() => void save("manual")}
              className={`${pill} bg-[#fdecec] text-[#b3201f] transition hover:bg-[#fbdcdc]`}
            >
              <AlertCircle size={14} /> Couldn&apos;t save · Retry
            </button>
          ) : dirty ? (
            <span className={`${pill} bg-[#fbf1d9] text-[#8a6414]`}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9a431]" />{" "}
              {changed.length} unsaved change{changed.length === 1 ? "" : "s"}
            </span>
          ) : lastSaved ? (
            <span className={`${pill} bg-[#e7f5ee] text-[#1b6b4a]`}>
              <CheckCircle2 size={14} /> Saved {ago(lastSaved, now)}
            </span>
          ) : (
            <span className={`${pill} bg-[#f5f4f0] text-[#6b665c]`}>
              No changes
            </span>
          )}

          {/* auto-save switch */}
          <button
            type="button"
            role="switch"
            aria-checked={auto}
            onClick={toggleAuto}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6b665c]"
            title="Save automatically 2 seconds after you stop typing"
          >
            <span
              className={`relative h-5 w-9 rounded-full transition ${auto ? "bg-[#c79a45]" : "bg-[#d8d1bf]"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${auto ? "left-[18px]" : "left-0.5"}`}
              />
            </span>
            Auto-save
          </button>

          {dirty && (
            <button
              type="button"
              className={`${ui.btn} !h-9`}
              onClick={() => setReviewOpen(true)}
            >
              <History size={15} /> Review
            </button>
          )}

          {/* tools menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="More tools"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`${ui.btn} !h-9 !w-9 !px-0`}
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-40 w-60 rounded-xl border border-[#e6e1d6] bg-white p-1.5 shadow-[0_20px_40px_-12px_rgba(18,16,13,0.25)]">
                <button type="button" className={menuItem} onClick={exportJson}>
                  <Download size={15} /> Export settings (JSON)
                </button>
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={15} /> Import settings…
                </button>
                <button
                  type="button"
                  disabled={!dirty}
                  className={`${menuItem} disabled:opacity-40 disabled:hover:bg-transparent`}
                  onClick={revertAll}
                >
                  <RotateCcw size={15} /> Revert all changes
                </button>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={onImport}
            />
          </div>

          <button
            type="submit"
            disabled={!dirty || status === "saving"}
            title="⌘/Ctrl + S"
            className={`${ui.btnPrimary} !h-9`}
          >
            {status === "saving" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}{" "}
            Save changes
          </button>
        </div>
      </div>

      {/* General */}
      <div className={show("general")}>
        <section className={panel}>
          <div className="md:col-span-2">
            {field("siteName", { placeholder: "AKSUM", max: 60 })}
          </div>
          {field("tagline_en", {
            max: 100,
            placeholder: "Independent journalism from the Horn of Africa",
          })}
          {field("tagline_am", { hint: "Optional" })}
          <div className="md:col-span-2">
            {field("contactEmail", {
              type: "email",
              placeholder: "newsroom@example.com",
              hint: "Shown on the contact page and used for reader replies.",
            })}
          </div>
        </section>
      </div>

      {/* SEO */}
      <div className={show("seo")}>
        <div className="grid max-w-[1000px] gap-5 lg:grid-cols-2">
          <section className={`${ui.card} p-5`}>
            {field("defaultSeoDescription", {
              rows: 6,
              max: 160,
              hint: "Used when an article has no description of its own. Aim for 120–160 characters.",
              action: (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a6414] hover:underline"
                  onClick={() =>
                    setField(
                      "defaultSeoDescription",
                      `${values.siteName}: ${values.tagline_en}`.slice(0, 160),
                    )
                  }
                >
                  <Wand2 size={11} /> Use tagline
                </button>
              ),
            })}
          </section>
          <section className={`${ui.card} flex flex-col gap-5 p-5`}>
            <div>
              <span className={ui.label}>Google result</span>
              <div className="rounded-xl border border-[#e6e1d6] bg-white px-4 py-3.5">
                <small className="block truncate text-xs text-[#188038]">
                  yoursite.com
                </small>
                <b className="my-0.5 block text-lg font-medium leading-snug text-[#1a0dab]">
                  {seoTitle}
                </b>
                <p className="text-[13px] leading-relaxed text-[#4d5156]">
                  {seoDesc}
                </p>
              </div>
            </div>
            <div>
              <span className={ui.label}>Social share card</span>
              <div className="overflow-hidden rounded-xl border border-[#e6e1d6] bg-white">
                <div className="grid h-28 place-items-center bg-gradient-to-br from-[#12100d] to-[#2a2620] font-headline-en text-2xl font-bold tracking-[0.2em] text-[#c79a45]">
                  {(values.siteName || "SITE").toUpperCase()}
                </div>
                <div className="px-4 py-3">
                  <small className="text-[11px] uppercase tracking-wide text-[#6b665c]">
                    yoursite.com
                  </small>
                  <b className="block truncate text-sm">{seoTitle}</b>
                  <p className="line-clamp-2 text-xs text-[#6b665c]">
                    {seoDesc}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Social */}
      <div className={show("social")}>
        <section className={panel}>
          {field("twitterUrl", {
            type: "url",
            placeholder: "https://x.com/…",
            link: true,
          })}
          {field("facebookUrl", {
            type: "url",
            placeholder: "https://facebook.com/…",
            link: true,
          })}
          {field("instagramUrl", {
            type: "url",
            placeholder: "https://instagram.com/…",
            link: true,
          })}
          {field("whatsappUrl", {
            type: "url",
            placeholder: "https://wa.me/…",
            link: true,
          })}
          <p className="text-xs text-[#6b665c] md:col-span-2">
            Paste the full profile link. Use the arrow icon on a valid link to
            test it in a new tab.
          </p>
        </section>
      </div>

      {/* Appearance */}
      <div ref={themeRef} className={show("appearance")} onClick={syncTheme}>
        <ThemePicker key={themeKey} defaultValue={Number(values.headerTheme)} />
      </div>

      {/* review dialog */}
      {reviewOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setReviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Review changes"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-[#f0ece1] px-5 py-4">
              <h2 className="font-headline-en text-lg font-bold">
                Review changes
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setReviewOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-[#f1ede2]"
              >
                <X size={16} />
              </button>
            </header>
            {changed.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-[#6b665c]">
                No unsaved changes.
              </p>
            ) : (
              <ul className="flex-1 divide-y divide-[#f0ece1] overflow-y-auto">
                {changed.map((f) => (
                  <li key={f.name} className="px-5 py-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold">
                        {f.label}{" "}
                        <span className="ml-1 text-[11px] font-medium capitalize text-[#a09a8c]">
                          {f.tab}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => reset(f.name)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a6414] hover:underline"
                      >
                        <Undo2 size={11} /> Revert
                      </button>
                    </div>
                    <p className="break-words text-xs text-[#a09a8c] line-through">
                      {fmtVal(f.name, baseline[f.name])}
                    </p>
                    <p className="break-words text-[13px] font-medium text-[#1b6b4a]">
                      {fmtVal(f.name, values[f.name])}
                    </p>
                    {shownError(f.name) && (
                      <p className="mt-1 text-xs font-medium text-[#b3201f]">
                        {errors[f.name]}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <footer className="flex items-center justify-between gap-3 border-t border-[#f0ece1] px-5 py-3.5">
              <button
                type="button"
                disabled={!dirty}
                onClick={revertAll}
                className={`${ui.btn} !h-9 disabled:opacity-40`}
              >
                <RotateCcw size={14} /> Revert all
              </button>
              <button
                type="button"
                disabled={!dirty || status === "saving"}
                className={`${ui.btnPrimary} !h-9`}
                onClick={() => {
                  setReviewOpen(false);
                  void save("manual");
                }}
              >
                <Save size={14} /> Save {changed.length} change
                {changed.length === 1 ? "" : "s"}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-[110] flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] ${
            toast.kind === "success"
              ? "bg-[#1b6b4a]"
              : toast.kind === "error"
                ? "bg-[#b3201f]"
                : "bg-aksum-black"
          }`}
        >
          {toast.kind === "success" ? (
            <CheckCircle2 size={16} />
          ) : toast.kind === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <History size={16} />
          )}
          {toast.msg}
        </div>
      )}
    </form>
  );
}
