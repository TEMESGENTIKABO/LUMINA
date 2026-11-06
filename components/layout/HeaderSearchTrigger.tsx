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

  // "/" or Ctrl/⌘+K opens search. Only the desktop pill listens, so the
  // overlay can never open twice.
  useEffect(() => {
    if (variant !== "pill") return;
    function onKey(e: KeyboardEvent) {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
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
          className="hidden h-10 w-[230px] items-center gap-2.5 rounded-full border border-white/15 bg-white/10 pl-3.5 pr-2 text-left font-ui text-[13px] text-white/60 transition hover:border-white/30 hover:bg-white/15 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold lg:flex xl:w-[260px]"
        >
          <Search size={15} />
          <span className="flex-1 truncate">{label}</span>
          <kbd className="rounded-md border border-white/20 px-1.5 py-0.5 font-ui text-[11px] font-semibold text-white/55">
            /
          </kbd>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label={label}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
        >
          <Search size={20} />
        </button>
      )}

      {/* Portalled so it is never trapped inside the sliding header. */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <SearchOverlay locale={locale} onClose={close} />,
          document.body,
        )}
    </>
  );
}
