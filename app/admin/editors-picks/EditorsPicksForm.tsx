"use client";

import { useState, useTransition } from "react";
import { setEditorsPicks } from "@/lib/admin/actions/editorsPickActions";

interface ArticleOption { id: string; title_en: string }

export function EditorsPicksForm({ articles, currentIds }: { articles: ArticleOption[]; currentIds: string[] }) {
  const [selected, setSelected] = useState<string[]>(currentIds);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  function handleSave() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await setEditorsPicks(selected);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="max-w-lg">
      <p className="font-ui text-xs text-obsidian-grey mb-3">{selected.length} / 4 selected</p>
      <div className="flex flex-col gap-1 max-h-96 overflow-y-auto border border-obsidian-grey/10 p-3">
        {articles.map((a) => (
          <label key={a.id} className="flex items-center gap-2 font-ui text-sm py-1">
            <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} disabled={!selected.includes(a.id) && selected.length >= 4} />
            {a.title_en}
          </label>
        ))}
      </div>
      {error && <p className="font-ui text-xs text-manuscript-red mt-2">{error}</p>}
      {saved && <p className="font-ui text-xs text-obsidian-grey mt-2">Saved.</p>}
      <button onClick={handleSave} disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 mt-4">
        {isPending ? "Saving..." : "Save Picks"}
      </button>
    </div>
  );
}
