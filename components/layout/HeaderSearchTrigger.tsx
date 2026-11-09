"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export function HeaderSearchTrigger({
  locale,
  label,
  variant = "pill",
}: {
  locale: string;
  label: string;
  variant?: "pill" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (variant !== "pill") return;
    function onKey(e: KeyboardEvent) {
      if (!window.matchMedia("(min-width: 1280px)").matches) return;
      const el = e.target as HTMLElement | null;
      const typing =
        !!el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (cmdK || (!typing && e.key === "/")) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  return (
    <>
      {variant === "pill" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label={label}
          className="group hidden h-9 min-w-0 flex-1 items-center gap-2 rounded-full border px-3 text-left font-ui text-[12.5px] transition-all duration-200 hover:border-[color:var(--hd-act)]/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--hd-act)] xl:flex xl:max-w-[240px]"
          style={{
            borderColor: "color-mix(in srgb, var(--hd-fg) 18%, transparent)",
            background: "color-mix(in srgb, var(--hd-fg) 8%, transparent)",
            color: "color-mix(in srgb, var(--hd-fg) 62%, transparent)",
          }}
        >
          <Search
            size={14}
            className="shrink-0 opacity-70 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <kbd
            className="shrink-0 rounded border px-1 py-0.5 font-ui text-[10px] font-semibold"
            style={{
              borderColor: "color-mix(in srgb, var(--hd-fg) 18%, transparent)",
              color: "color-mix(in srgb, var(--hd-fg) 55%, transparent)",
            }}
          >
            /
          </kbd>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label={label}
          className="hd-ib"
        >
          <Search size={19} />
        </button>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <SearchOverlay locale={locale} onClose={close} />,
          document.body,
        )}
    </>
  );
}
