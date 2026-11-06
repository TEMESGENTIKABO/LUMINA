"use client";

import { useTransition } from "react";
import { setSiteTheme } from "@/lib/admin/actions/settingsActions";

const THEMES = [
  { id: 1, name: "Premium & Elegant" },
  { id: 2, name: "Modern & Clean" },
  { id: 3, name: "Bold & Dynamic" },
  { id: 4, name: "Minimalist Cream" },
  { id: 5, name: "Vibrant & Trendy" },
  { id: 6, name: "Classic Magazine" },
  { id: 7, name: "Newsroom" },
  { id: 8, name: "Broadsheet" },
  { id: 9, name: "Heritage" },
  { id: 10, name: "Midnight" },
];

export function ThemeQuickSwitch({ current }: { current: number }) {
  const [pending, start] = useTransition();

  return (
    <label className="flex items-center gap-2 text-[12px] text-[#6b665c]">
      <span className="hidden lg:inline">Theme</span>
      <select
        key={current} // <--- THIS IS THE MAGIC FIX
        defaultValue={current}
        disabled={pending}
         onChange={(e) => {
          start(() => {
            void setSiteTheme(Number(e.target.value));
          });
        }}
        aria-label="Site theme"
        className="h-[34px] px-2.5 border border-[#e6e1d6] rounded-lg bg-white text-[13px] text-[#12100d] focus:outline-none focus:border-[#c9a227] transition-colors"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.id}. {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
