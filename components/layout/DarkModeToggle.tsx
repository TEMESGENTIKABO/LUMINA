"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const dark = useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => onChange();
      window.addEventListener("storage", handleChange);
      window.addEventListener("aksum-theme-change", handleChange);
      media.addEventListener("change", handleChange);
      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener("aksum-theme-change", handleChange);
        media.removeEventListener("change", handleChange);
      };
    },
    () => {
      const stored = localStorage.getItem("aksum-theme");
      return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
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

  if (!mounted) return <span className="w-4 h-4 inline-block" aria-hidden="true" />;

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="text-obsidian-grey hover:text-aksum-black">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
