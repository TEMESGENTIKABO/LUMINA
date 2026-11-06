"use client";

import { useState } from "react";

interface Revision {
  id: string;
  title_en: string;
  dek_en: string;
  createdAt: Date | string;
  editedBy: { name: string | null; email: string | null };
}

function diffWords(oldText: string, newText: string) {
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);
  const result: { text: string; type: "same" | "added" | "removed" }[] = [];

  let i = 0, j = 0;
  while (i < oldWords.length || j < newWords.length) {
    if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
      result.push({ text: oldWords[i], type: "same" });
      i++; j++;
    } else if (j < newWords.length && !oldWords.slice(i, i + 3).includes(newWords[j])) {
      result.push({ text: newWords[j], type: "added" });
      j++;
    } else if (i < oldWords.length) {
      result.push({ text: oldWords[i], type: "removed" });
      i++;
    } else {
      result.push({ text: newWords[j], type: "added" });
      j++;
    }
  }
  return result;
}

export function RevisionDiff({ revisions }: { revisions: Revision[] }) {
  const [compareId, setCompareId] = useState<string | null>(null);

  if (revisions.length < 2) return null;

  const compareIndex = compareId ? revisions.findIndex((r) => r.id === compareId) : 1;
  const newer = revisions[0];
  const older = revisions[compareIndex] ?? revisions[1];

  const titleDiff = diffWords(older.title_en, newer.title_en);
  const dekDiff = diffWords(older.dek_en, newer.dek_en);

  return (
    <div className="border border-hairline-strong p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <p className="section-label text-obsidian-grey/60">Compare Current To</p>
        <select
          value={compareId ?? revisions[1]?.id ?? ""}
          onChange={(e) => setCompareId(e.target.value)}
          className="border border-obsidian-grey/20 px-2 py-1 font-ui text-xs bg-parchment-white"
        >
          {revisions.slice(1).map((r) => (
            <option key={r.id} value={r.id}>
              {new Date(r.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} - {r.editedBy.name ?? r.editedBy.email}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/50 mb-1">Title</p>
          <p className="font-body-en text-sm leading-relaxed">
            {titleDiff.map((word, i) => (
              <span
                key={i}
                className={
                  word.type === "added" ? "bg-manuscript-red/10 text-manuscript-red" :
                  word.type === "removed" ? "bg-obsidian-grey/10 text-obsidian-grey/50 line-through" : ""
                }
              >
                {word.text}{" "}
              </span>
            ))}
          </p>
        </div>
        <div>
          <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/50 mb-1">Dek</p>
          <p className="font-body-en text-sm leading-relaxed">
            {dekDiff.map((word, i) => (
              <span
                key={i}
                className={
                  word.type === "added" ? "bg-manuscript-red/10 text-manuscript-red" :
                  word.type === "removed" ? "bg-obsidian-grey/10 text-obsidian-grey/50 line-through" : ""
                }
              >
                {word.text}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
      <p className="font-ui text-[10px] text-obsidian-grey/40 mt-4">
        Note: body text diffing is not shown here (word-level diffs on long-form rich text get noisy) - title/dek changes are usually the fastest way to spot what actually changed between saves.
      </p>
    </div>
  );
}
