"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

const SCALES = [0.9, 1, 1.15, 1.3];
const STORAGE_KEY = "aksum-article-font-scale";

export function FontSizeControl() {
  const [index, setIndex] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    const idx = stored ? Number(stored) : 1;
    setIndex(idx);
    document.documentElement.style.setProperty("--article-font-scale", String(SCALES[idx]));
  }, []);

  function adjust(delta: number) {
    const next = Math.min(SCALES.length - 1, Math.max(0, index + delta));
    setIndex(next);
    document.documentElement.style.setProperty("--article-font-scale", String(SCALES[next]));
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  if (!mounted) return <span className="w-16 h-7 inline-block" aria-hidden="true" />;

  return (
    <div className="flex items-center gap-1.5 border border-obsidian-grey/20 px-2 py-1 flex-shrink-0">
      <button onClick={() => adjust(-1)} disabled={index === 0} aria-label="Decrease text size" className="text-obsidian-grey hover:text-aksum-black disabled:opacity-30 p-0.5">
        <Minus size={12} />
      </button>
      <span className="font-ui text-xs text-obsidian-grey">Aa</span>
      <button onClick={() => adjust(1)} disabled={index === SCALES.length - 1} aria-label="Increase text size" className="text-obsidian-grey hover:text-aksum-black disabled:opacity-30 p-0.5">
        <Plus size={12} />
      </button>
    </div>
  );
}
