"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaUploader } from "./MediaUploader";
import { MediaGrid } from "./MediaGrid";
import { Trash2, Loader2 } from "lucide-react";
import { bulkDeleteMedia } from "@/lib/admin/actions/mediaActions";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altText?: string | null;
}

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleBulkDelete() {
    if (
      !confirm(`Are you sure you want to delete ${selectedIds.length} images?`)
    )
      return;
    setDeleting(true);
    const res = await bulkDeleteMedia(selectedIds);
    setDeleting(false);
    if (!res.error) {
      setSelectedIds([]);
      router.refresh();
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      <div className="flex-1 space-y-6">
        <MediaUploader onUploadSuccess={() => router.refresh()} />

        {selectedIds.length > 0 && (
          <div className="sticky top-4 z-10 flex items-center gap-4 rounded-xl bg-[#1e2028] px-5 py-3 text-white shadow-xl">
            <span className="font-ui text-sm font-medium">
              <span className="bg-[#c9a227] text-[#1a1405] px-2 py-0.5 rounded-full text-xs font-bold mr-2">
                {selectedIds.length}
              </span>
              selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="font-ui text-sm font-semibold text-[#c9a227] hover:text-[#e0b83a] transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete selected"}
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="ml-auto font-ui text-sm text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e5e3df] p-5">
          <MediaGrid
            items={initialItems}
            mode="browse"
            selectedId={selectedId ?? undefined}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelect={(item) => {
              setSelectedId(item.id);
              if (selectedIds.length === 0) setSelectedIds([item.id]);
            }}
          />
        </div>
      </div>

      {selectedId && (
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-[#e5e3df] p-5 shadow-sm">
            <img
              src={initialItems.find((i) => i.id === selectedId)?.url}
              alt=""
              className="w-full aspect-square object-cover rounded-xl mb-4"
            />
            <p className="font-ui text-xs font-bold uppercase text-[#8b8f99] mb-1">
              Filename
            </p>
            <p className="font-ui text-sm text-[#1a1c23] break-all mb-4">
              {initialItems.find((i) => i.id === selectedId)?.filename}
            </p>

            <button
              onClick={async () => {
                if (!selectedId) return;
                if (!confirm("Delete this image?")) return;
                const res = await fetch(`/api/admin/media/${selectedId}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  setSelectedId(null);
                  router.refresh();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fbeeee] text-[#9b4a4a] font-ui text-sm font-semibold hover:bg-[#f3c4c4] transition-colors"
            >
              <Trash2 size={16} /> Delete Image
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
