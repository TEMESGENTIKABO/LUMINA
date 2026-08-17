"use client";

import { useEffect, useState, useMemo } from "react";
import { MediaUploader } from "./MediaUploader";
import { MediaGrid } from "./MediaGrid";
import { Search, X, ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string>("");

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const loadMedia = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/admin/media");
        const data = await res.json();

        if (!isMounted) return;

        setItems(data.media ?? []);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;
    };
  }, [open]);

  const resetSelection = () => {
    setSearchQuery("");
    setSelectedUrl("");
  };

  const handleClose = () => {
    resetSelection();
    onClose();
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => item.filename.toLowerCase().includes(q));
  }, [items, searchQuery]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#0f1115]/60 z-[80] flex items-start justify-center pt-[5vh] px-4 pb-4">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-[#e5e3df]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e3df] bg-[#faf9f7] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ImageIcon size={16} className="text-[#8b8f99]" />
            <h2 className="font-headline-en text-sm font-semibold text-[#1a1c23] tracking-tight">
              Media Library
            </h2>
            <span className="font-ui text-[11px] text-[#a5a39e] tabular-nums">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#8b8f99] hover:text-[#1a1c23] hover:bg-[#f0eeea] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-[#e5e3df] flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a5a39e]"
            />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 font-ui text-sm border border-[#e5e3df] bg-white text-[#1a1c23] placeholder:text-[#b8b5b0] focus:outline-none focus:border-[#8b8f99] transition-colors"
            />
          </div>
          <div className="flex-1" />
          {selectedUrl && (
            <button
              onClick={() => {
                onSelect(selectedUrl);
                onClose();
              }}
              className="font-ui text-xs font-medium px-3 py-1.5 bg-[#1a1c23] text-[#f5f3ef] hover:bg-[#2a2c34] transition-colors"
            >
              Select Image
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-5">
            <MediaUploader />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-[#a5a39e]">
              <div className="w-4 h-4 border-2 border-[#d4d2cd] border-t-[#8b8f99] rounded-full animate-spin" />
              <span className="font-ui text-sm">Loading media...</span>
            </div>
          ) : (
            <MediaGrid
              items={filteredItems}
              mode="picker"
              selectedUrl={selectedUrl}
              onSelect={(url) => setSelectedUrl(url)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#e5e3df] bg-[#faf9f7] flex items-center justify-between flex-shrink-0">
          <p className="font-ui text-[11px] text-[#a5a39e]">
            Click an image to select it, then confirm above.
          </p>
          <button
            onClick={onClose}
            className="font-ui text-xs text-[#6b6f7a] hover:text-[#1a1c23] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
