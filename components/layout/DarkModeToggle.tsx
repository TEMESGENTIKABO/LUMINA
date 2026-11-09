"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle({ className = "" }: { className?: string }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dark = useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      window.addEventListener("storage", onChange);
      window.addEventListener("aksum-theme-change", onChange);
      media.addEventListener("change", onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("aksum-theme-change", onChange);
        media.removeEventListener("change", onChange);
      };
    },
    () => {
      const stored = localStorage.getItem("aksum-theme");
      return stored
        ? stored === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
    },
    () => false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("aksum-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("aksum-theme-change"));
  }

  // Same footprint before hydration, so nothing shifts.
  if (!mounted) return <span className={className} aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={className}
    >
      {/* key re-mounts the icon so the CSS swap animation replays */}
      {dark ? (
        <Sun key="s" size={18} className="hd-swap" />
      ) : (
        <Moon key="m" size={18} className="hd-swap" />
      )}
    </button>
  );
}
