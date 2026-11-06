"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function GenericBulkSelectTable({
  items,
  rows,
  headers,
  onBulkDelete,
  itemLabel,
}: {
  items: { id: string }[];
  rows: React.ReactNode[];
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
        <div className="sticky top-2 z-10 bg-aksum-black text-parchment-white rounded-xl shadow-xl shadow-black/20 px-5 py-3 flex items-center gap-4 mb-4">
          <span className="font-ui text-sm font-medium"><span className="px-2 py-0.5 mr-2 rounded-full bg-[#c9a227] text-aksum-black text-xs font-semibold">{selected.length}</span>selected</span>
          <button onClick={handleBulkDelete} disabled={isPending} className={`font-ui text-sm px-3 py-1.5 rounded-lg transition-colors ${confirming ? "bg-[#9b4a4a] text-white font-semibold" : "bg-white/10 hover:bg-white/15"}`}>
            {isPending ? "Deleting..." : confirming ? "Confirm delete?" : `Delete selected ${itemLabel}`}
          </button>
          <button onClick={() => setSelected([])} className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white ml-auto">Clear</button>
          {error && <span className="font-ui text-xs text-aksum-gold">{error}</span>}
        </div>
      )}
      <div className="overflow-x-auto bg-white rounded-2xl border border-[#e5e3df] shadow-[0_1px_2px_rgba(26,28,35,0.04)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#faf9f7] border-b border-[#e5e3df]">
            <th className="px-5 py-3.5 w-10"></th>
            {headers.map((h, i) => (
              <th key={i} className="text-left font-ui text-[11px] font-semibold uppercase tracking-wider text-[#6b6f7a] px-5 py-3.5 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0eeea] [&_td]:py-3.5 [&_td]:font-ui">
          {items.map((item, i) => (
            <tr key={item.id} className={`transition-colors ${selected.includes(item.id) ? "bg-[#faf6e8]" : "hover:bg-[#faf9f7]"}`}>
              <td className="px-5">
                <input type="checkbox" className="w-4 h-4 rounded border-[#d4d2cd] accent-[#c9a227] cursor-pointer" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
              </td>
              {rows[i]}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
