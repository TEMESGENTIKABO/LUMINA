"use client";

import { useSyncExternalStore } from "react";
import { BookOpen, Moon, Sun } from "lucide-react";

const MODES = ["light", "sepia", "dark"] as const;
type Mode = (typeof MODES)[number];
const KEY = "aksum-reading";
const CHANGE_EVENT = "aksum-reading-change";

function getMode(): Mode {
  try {
    const saved = localStorage.getItem(KEY) as Mode | null;
    if (saved && MODES.includes(saved)) return saved;
  } catch {}
  return "light";
}

function subscribeToMode(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// Runs before paint so a saved dark/sepia choice doesn't flash white.
export function ReadingInit() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{var m=localStorage.getItem("${KEY}");if(m)document.documentElement.dataset.reading=m}catch(e){}`,
      }}
    />
  );
}

export function ReadingModeToggle({ label }: { label: string }) {
  const mode = useSyncExternalStore<Mode>(subscribeToMode, getMode, () => "light");

  function next() {
    const n = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    document.documentElement.dataset.reading = n;
    try {
      localStorage.setItem(KEY, n);
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  const Icon = mode === "dark" ? Moon : mode === "sepia" ? BookOpen : Sun;
  return (
    <button
      type="button"
      className="art-sb"
      onClick={next}
      aria-label={`${label}: ${mode}`}
      title={`${label}: ${mode}`}
    >
      <Icon size={19} />
    </button>
  );
}
