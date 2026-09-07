"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { deleteMedia, bulkDeleteMedia } from "@/lib/admin/actions/mediaActions";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export function MediaGrid({
  items,
  mode = "browse",
  onSelect,
}: {
  items: MediaItem[];
  mode?: "browse" | "picker";
  onSelect?: (url: string) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  function toggleSelect(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleBulkDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setError("");
    const result = await bulkDeleteMedia(selected);
    if (result.error) {
      setError(result.error);
    } else {
      setSelected([]);
      router.refresh();
    }
    setConfirming(false);
  }

  if (items.length === 0) {
    return <p className="font-ui text-sm text-obsidian-grey">No media uploaded yet.</p>;
  }

  return (
    <div>
      {mode === "browse" && selected.length > 0 && (
        <div className="sticky top-0 z-10 bg-aksum-black text-parchment-white px-4 py-3 flex items-center gap-4 mb-4">
          <span className="font-ui text-sm">{selected.length} selected</span>
          <button onClick={handleBulkDelete} className={`font-ui text-sm ${confirming ? "text-manuscript-red font-bold" : "hover:text-manuscript-red"}`}>
            {confirming ? "Confirm delete?" : "Delete selected"}
          </button>
          <button onClick={() => setSelected([])} className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white ml-auto">Clear</button>
          {error && <span className="font-ui text-xs text-aksum-gold">{error}</span>}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <div key={item.id} className="group relative">
              <button
                type="button"
                onClick={() => (mode === "picker" ? onSelect?.(item.url) : setSelected((prev) => (prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id])))}
                className="relative aspect-square w-full overflow-hidden bg-obsidian-grey/10 block"
              >
                <Image src={item.url} alt={item.filename} fill sizes="150px" className="object-cover" />
                {mode === "browse" && isSelected && (
                  <div className="absolute inset-0 bg-aksum-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 bg-aksum-gold rounded-full flex items-center justify-center">
                      <Check size={14} className="text-aksum-black" />
                    </div>
                  </div>
                )}
              </button>
              {mode === "browse" && (
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ConfirmDeleteButton itemName={item.filename} onDelete={() => deleteMedia(item.id)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
