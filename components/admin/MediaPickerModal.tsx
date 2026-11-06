"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { MediaUploader } from "./MediaUploader";
import { MediaGrid } from "./MediaGrid";
import {
  Search,
  X,
  Image as ImageIcon,
  Check,
  Loader2,
  Save,
} from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altText?: string | null;
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [editAlt, setEditAlt] = useState("");
  const [savingAlt, setSavingAlt] = useState(false);

  async function loadMedia() {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setItems(data.media ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function initialize() {
      await Promise.resolve();
      if (cancelled) return;
      setSelected(null);
      setMultiSelect([]);
      await loadMedia();
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.filename.toLowerCase().includes(q));
  }, [items, search]);

  async function saveAlt() {
    if (!selected) return;
    setSavingAlt(true);
    await fetch(`/api/admin/media/${selected.id}`, {
      method: "PATCH",
      body: JSON.stringify({ altText: editAlt }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, altText: editAlt } : i)),
    );
    setSelected((prev) => (prev ? { ...prev, altText: editAlt } : null));
    setSavingAlt(false);
  }

  function toggleMultiSelect(id: string) {
    setMultiSelect((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleSelect(item: MediaItem) {
    setSelected(item);
    setEditAlt(item.altText || "");
  }

  function handleInsert() {
    if (multiSelect.length > 0) {
      const urls = items
        .filter((i) => multiSelect.includes(i.id))
        .map((i) => i.url);
      onSelect(urls);
    } else if (selected) {
      onSelect([selected.url]);
    }
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#faf9f7] flex flex-col">
      {/* Header */}
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[#e5e3df] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1e2028] flex items-center justify-center">
            <ImageIcon size={16} className="text-[#c9a227]" />
          </div>
          <h2 className="font-headline-en text-lg font-bold text-[#1a1c23]">
            Media Library
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f5f4f2] text-[#6b6f7a] transition-colors"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Upload & Search */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-[#e5e3df] flex flex-col p-4 gap-4">
          <MediaUploader onUploadSuccess={loadMedia} />
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5a39e]"
            />
            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e5e3df] bg-[#faf9f7] font-ui text-sm focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20 transition-all"
            />
          </div>
          <div className="mt-auto border-t border-[#e5e3df] pt-4">
            <button
              onClick={handleInsert}
              disabled={multiSelect.length === 0 && !selected}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1e2028] text-white font-ui text-sm font-semibold shadow-md hover:bg-[#2a2c34] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Check size={16} className="text-[#c9a227]" />
              Insert{" "}
              {multiSelect.length > 0
                ? `${multiSelect.length} Images`
                : "Image"}
            </button>
          </div>
        </aside>

        {/* Center: Grid */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#faf9f7]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8b8f99]">
              <Loader2 size={24} className="animate-spin text-[#c9a227]" />
              <p className="font-ui text-sm">Loading library...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <ImageIcon size={32} className="text-[#d4d2cd]" />
              <p className="font-ui text-sm text-[#8b8f99]">No images found.</p>
            </div>
          ) : (
            <MediaGrid
              items={filtered}
              selectedId={selected?.id}
              selectedIds={multiSelect}
              onSelect={handleSelect}
              onToggleSelect={toggleMultiSelect}
            />
          )}
        </main>

        {/* Right Inspector */}
        <aside className="w-80 flex-shrink-0 bg-white border-l border-[#e5e3df] flex flex-col">
          {selected ? (
            <>
              <div className="aspect-square bg-[#f5f4f2] relative border-b border-[#e5e3df]">
                <Image
                  src={selected.url}
                  alt={selected.filename}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-5 flex-1 space-y-4 overflow-y-auto">
                <div>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-[#8b8f99] mb-1">
                    Filename
                  </p>
                  <p className="font-ui text-sm text-[#1a1c23] break-all">
                    {selected.filename}
                  </p>
                </div>
                <div>
                  <label className="font-ui text-[10px] font-bold uppercase tracking-wider text-[#8b8f99] mb-1 block">
                    Alt Text (SEO)
                  </label>
                  <textarea
                    rows={3}
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    placeholder="Describe the image for accessibility..."
                    className="w-full rounded-xl border border-[#e5e3df] p-3 font-ui text-sm focus:outline-none focus:border-[#c9a227] focus:ring-2 focus:ring-[#c9a227]/20 resize-none"
                  />
                  <button
                    onClick={saveAlt}
                    disabled={savingAlt || editAlt === (selected.altText || "")}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#9a7b1a] hover:text-[#c9a227] disabled:opacity-40 transition-colors"
                  >
                    {savingAlt ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                    {savingAlt ? "Saving..." : "Save Alt Text"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#8b8f99] p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f5f4f2] flex items-center justify-center mb-4">
                <ImageIcon size={24} className="text-[#c9a227]" />
              </div>
              <p className="font-ui text-sm font-medium text-[#1a1c23]">
                Select an image
              </p>
              <p className="font-ui text-xs mt-1 text-[#a5a39e]">
                Choose an image from the grid to preview and edit its metadata.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
