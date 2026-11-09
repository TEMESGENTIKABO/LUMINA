"use client";

import { useEffect, useSyncExternalStore } from "react";
import { BookOpen, Moon, Sun } from "lucide-react";

const MODES = ["light", "sepia", "dark"] as const;
type Mode = (typeof MODES)[number];

const KEY = "aksum-reading";
const CHANGE_EVENT = "aksum-reading-change";

function getMode(): Mode {
  try {
    const saved = localStorage.getItem(KEY);

    if (saved && MODES.includes(saved as Mode)) {
      return saved as Mode;
    }
  } catch {
    // Ignore localStorage errors.
  }

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

// No script tag. No inline JavaScript.
export function ReadingInit() {
  const mode = useSyncExternalStore<Mode>(subscribeToMode, getMode, () => "light");

  useEffect(() => {
    document.documentElement.dataset.reading = mode;
  }, [mode]);

  return null;
}

export function ReadingModeToggle({ label }: { label: string }) {
  const mode = useSyncExternalStore<Mode>(subscribeToMode, getMode, () => "light");

  function next() {
    const index = MODES.indexOf(mode);
    const nextMode = MODES[(index + 1) % MODES.length];

    document.documentElement.dataset.reading = nextMode;

    try {
      localStorage.setItem(KEY, nextMode);
    } catch {
      // Ignore storage errors.
    }

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
