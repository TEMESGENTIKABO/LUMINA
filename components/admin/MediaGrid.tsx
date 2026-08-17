"use client";

import { useState } from "react";
import Image from "next/image";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { deleteMedia } from "@/lib/admin/actions/mediaActions";
import { ImageIcon, Check } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export function MediaGrid({
  items,
  mode = "browse",
  onSelect,
  selectedUrl,
}: {
  items: MediaItem[];
  mode?: "browse" | "picker";
  onSelect?: (url: string) => void;
  selectedUrl?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-[#d4d2cd] bg-[#faf9f7]">
        <ImageIcon size={24} className="text-[#d4d2cd] mb-2" />
        <p className="font-ui text-sm text-[#a5a39e]">No media uploaded yet.</p>
        <p className="font-ui text-xs text-[#c4c2bc] mt-1">
          Upload images to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <MediaGridItem
          key={item.id}
          item={item}
          mode={mode}
          isSelected={selectedUrl === item.url}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function MediaGridItem({
  item,
  mode,
  isSelected,
  onSelect,
}: {
  item: MediaItem;
  mode: "browse" | "picker";
  isSelected?: boolean;
  onSelect?: (url: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => onSelect?.(item.url)}
        className={`
          relative aspect-square w-full overflow-hidden bg-[#f0eeea] block
          border transition-all duration-150
          ${isSelected ? "border-[#c9a227] ring-1 ring-[#c9a227]" : "border-[#e5e3df] hover:border-[#c9a227]"}
        `}
      >
        <Image
          src={item.url}
          alt={item.filename}
          fill
          sizes="150px"
          className={`object-cover transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#c9a227] flex items-center justify-center">
            <Check size={12} className="text-[#1a1c23]" strokeWidth={3} />
          </div>
        )}

        {/* Hover overlay with metadata */}
        <div
          className={`
            absolute inset-x-0 bottom-0 bg-[#1a1c23]/80 backdrop-blur-[2px]
            transition-all duration-150
            ${hovered || mode === "picker" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
          `}
        >
          <p className="font-ui text-[10px] text-[#d4d2cd] px-2 py-1.5 truncate">
            {item.filename}
          </p>
        </div>
      </button>

      {/* Delete action - browse mode only */}
      {mode === "browse" && hovered && (
        <div className="absolute top-1.5 right-1.5">
          <ConfirmDeleteButton
            itemName={item.filename}
            onDelete={() => deleteMedia(item.id)}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
