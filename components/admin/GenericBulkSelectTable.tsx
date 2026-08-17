"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function GenericBulkSelectTable<T extends { id: string }>({
  items,
  renderRow,
  headers,
  onBulkDelete,
  itemLabel,
}: {
  items: T[];
  renderRow: (item: T, checkbox: React.ReactNode) => React.ReactNode;
  headers: string[];
  onBulkDelete: (ids: string[]) => Promise<{ error?: string; success?: boolean; count?: number }>;
  itemLabel: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleBulkDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await onBulkDelete(selected);
      if (result.error) {
        setError(result.error);
      } else {
        setSelected([]);
        router.refresh();
      }
      setConfirming(false);
    });
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="sticky top-0 z-10 bg-aksum-black text-parchment-white px-4 py-3 flex items-center gap-4 mb-4">
          <span className="font-ui text-sm">{selected.length} selected</span>
          <button onClick={handleBulkDelete} disabled={isPending} className={`font-ui text-sm ${confirming ? "text-manuscript-red font-bold" : "hover:text-manuscript-red"}`}>
            {isPending ? "Deleting..." : confirming ? "Confirm delete?" : `Delete selected ${itemLabel}`}
          </button>
          <button onClick={() => setSelected([])} className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white ml-auto">Clear</button>
          {error && <span className="font-ui text-xs text-aksum-gold">{error}</span>}
        </div>
      )}
      <table className="w-full border border-obsidian-grey/10">
        <thead>
          <tr className="border-b border-obsidian-grey/10 bg-obsidian-grey/5">
            <th className="px-4 py-3"></th>
            {headers.map((h, i) => (
              <th key={i} className="text-left font-ui text-xs uppercase tracking-wide text-obsidian-grey px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-obsidian-grey/10">
          {items.map((item) => {
            const checkbox = <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />;
            return renderRow(item, checkbox);
          })}
        </tbody>
      </table>
    </div>
  );
}
