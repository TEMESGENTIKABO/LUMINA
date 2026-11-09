"use client";

import { useEffect } from "react";

export const TEXT_SIZE_KEY = "aksum-text-size";
export const TEXT_SIZES = { s: "15px", m: "16px", l: "18px", xl: "20px" } as const;
export type TextSize = keyof typeof TEXT_SIZES;

export function applyTextSize(size: TextSize) {
  document.documentElement.style.fontSize = size === "m" ? "" : TEXT_SIZES[size];
}

/** Put once in your root layout so the chosen text size applies on every page. */
export function TextSizeInit() {
  useEffect(() => {
    try {
      const v = localStorage.getItem(TEXT_SIZE_KEY) as TextSize | null;
      if (v && v in TEXT_SIZES) applyTextSize(v);
    } catch {}
  }, []);
  return null;
}
