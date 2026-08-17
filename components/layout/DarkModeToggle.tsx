"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("aksum-theme");
    const prefersDark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("aksum-theme", next ? "dark" : "light");
  }

  if (!mounted) return <span className="w-4 h-4 inline-block" aria-hidden="true" />;

  return (
    <button onClick={toggle} aria-label="Toggle dark mode" className="text-obsidian-grey hover:text-aksum-black">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
