"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { SearchOverlay } from "@/components/search/SearchOverlay";

interface HeaderSearchTriggerProps {
  locale: string;
  label: string;
}

export function HeaderSearchTrigger({
  locale,
  label,
}: HeaderSearchTriggerProps) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2 px-3 py-1.5 font-ui text-sm text-obsidian-grey hover:text-aksum-black transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-black/10 rounded-full"
        aria-label={label}
      >
        <Search
          size={16}
          className="text-obsidian-grey group-hover:text-aksum-black transition-colors duration-200"
          strokeWidth={2}
        />
        <span className="hidden md:inline text-[13px] font-medium">
          {label}
        </span>
      </button>

      {open && <SearchOverlay locale={locale} onClose={handleClose} />}
    </>
  );
}
