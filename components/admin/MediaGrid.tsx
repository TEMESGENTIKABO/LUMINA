"use client";

import Image from "next/image";
import { Check, Trash2, Edit3, Eye } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  altText?: string | null;
}

export function MediaGrid({
  items,
  selectedId,
  selectedIds = [],
  onSelect,
  onToggleSelect,
  onDelete,
}: {
  items: MediaItem[];
  selectedId?: string | null;
  selectedIds?: string[];
  onSelect: (item: MediaItem) => void;
  onToggleSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const isChecked = selectedIds.includes(item.id);

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all duration-200 ${
              isSelected
                ? "border-[#c9a227] shadow-[0_0_0_4px_rgba(201,162,39,0.15)]"
                : "border-[#e5e3df] hover:border-[#d4d2cd] hover:shadow-lg"
            }`}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full bg-[#f5f4f2] overflow-hidden">
              <Image
                src={item.url}
                alt={item.altText || item.filename}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#1e2028]/30 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="w-8 h-8 rounded-full bg-[#c9a227] flex items-center justify-center shadow-lg transform scale-110">
                    <Check
                      size={16}
                      className="text-[#1a1405]"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              )}

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="w-7 h-7 rounded-lg bg-white/90 hover:bg-[#9b4a4a] hover:text-white text-[#6b6f7a] flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {/* Bulk Checkbox */}
              {onToggleSelect && (
                <div
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(item.id);
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      isChecked
                        ? "bg-[#c9a227] border-[#c9a227]"
                        : "bg-white/80 border-[#a5a39e] hover:border-[#c9a227]"
                    }`}
                  >
                    {isChecked && (
                      <Check
                        size={12}
                        className="text-[#1a1405]"
                        strokeWidth={4}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="px-3 py-2 border-t border-[#f0eeea] bg-white">
              <p className="font-ui text-[11px] font-medium text-[#1a1c23] truncate">
                {item.filename}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
