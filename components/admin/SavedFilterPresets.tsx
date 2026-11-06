"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Bookmark, X } from "lucide-react";

interface Preset { name: string; query: string }
const STORAGE_KEY = "aksum-admin-article-presets";

export function SavedFilterPresets() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPresets(JSON.parse(stored));
  }, []);

  function saveCurrent() {
    if (!name.trim()) return;
    const query = searchParams.toString();
    const next = [...presets.filter((p) => p.name !== name), { name: name.trim(), query }];
    setPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setName("");
    setSaving(false);
  }

  function remove(presetName: string) {
    const next = presets.filter((p) => p.name !== presetName);
    setPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {presets.map((preset) => (
        <div key={preset.name} className="flex items-center gap-1 rounded-full bg-white border border-[#e5e3df] pl-3 pr-2 py-1 hover:border-[#c9a227]/50 transition-colors">
          <button onClick={() => router.push(`${pathname}?${preset.query}`)} className="font-ui text-xs font-medium text-[#6b6f7a] hover:text-[#1a1c23] flex items-center gap-1.5">
            <Bookmark size={11} className="text-[#c9a227]" /> {preset.name}
          </button>
          <button onClick={() => remove(preset.name)} aria-label="Remove preset" className="text-[#b8b5b0] hover:text-manuscript-red p-0.5">
            <X size={11} />
          </button>
        </div>
      ))}

      {hasActiveFilters && (
        saving ? (
          <div className="flex items-center gap-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Preset name"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && saveCurrent()}
              className="rounded-full border border-[#e5e3df] bg-white px-3 py-1 font-ui text-xs w-36 focus:outline-none focus:border-[#c9a227]/60 focus:ring-4 focus:ring-[#c9a227]/10"
            />
            <button onClick={saveCurrent} className="font-ui text-xs font-semibold text-[#9a7b1a] hover:text-[#c9a227] px-2">Save</button>
          </div>
        ) : (
          <button onClick={() => setSaving(true)} className="font-ui text-xs font-medium text-[#6b6f7a] hover:text-[#1a1c23] rounded-full border border-dashed border-[#d4d2cd] hover:border-[#c9a227] px-3 py-1 flex items-center gap-1.5 transition-colors">
            <Bookmark size={11} /> Save this view
          </button>
        )
      )}
    </div>
  );
}
