"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { DarkModeToggle } from "./DarkModeToggle";

interface BreakingItem {
  title: string;
  href: string;
}

export function LiveStrip({
  locale,
  items,
  dateLabel,
  ethLabel,
  weather,
}: {
  locale: string;
  items: BreakingItem[];
  dateLabel: string;
  ethLabel: string;
  weather: React.ReactNode;
}) {
  const [i, setI] = useState(0);

  // Rotate one headline at a time. Re-runs after a manual "next" to reset the timer.
  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length, i]);

  const current = items[i];

  return (
    <div className="border-b border-hairline bg-parchment-white">
      <style>{`@keyframes strip-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.strip-in{animation:strip-in .35s ease-out}`}</style>
      <div className="max-w-page mx-auto flex h-9 items-center gap-4 px-6 font-ui text-xs">
        {current ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex shrink-0 items-center gap-1.5 rounded-[2px] bg-manuscript-red px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.1em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
              Breaking
            </span>
            <Link
              key={i}
              href={current.href}
              className="strip-in min-w-0 truncate font-medium text-aksum-black transition-colors hover:text-manuscript-red"
            >
              {current.title}
            </Link>
            {items.length > 1 && (
              <button
                onClick={() => setI((i + 1) % items.length)}
                aria-label="Next headline"
                className="ml-auto flex shrink-0 items-center gap-0.5 tabular-nums text-obsidian-grey/60 transition-colors hover:text-aksum-black"
              >
                {i + 1} / {items.length}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="hidden shrink-0 items-center gap-4 text-obsidian-grey/75 lg:flex">
          <span>
            <strong className="font-semibold text-aksum-black">
              {dateLabel}
            </strong>{" "}
            · {ethLabel}
          </span>
          {weather}
          <span className="h-3 w-px bg-obsidian-grey/20" />
          <LanguageToggle currentLocale={locale} />
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
}
