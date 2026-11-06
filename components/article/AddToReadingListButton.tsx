"use client";

import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { useReadingList } from "./ReadingListDrawer";

export function AddToReadingListButton({ slug, title }: { slug: string; title: string }) {
  const { list, add, remove } = useReadingList();
  const isQueued = list.some((a) => a.slug === slug);

  return (
    <button
      onClick={() => (isQueued ? remove(slug) : add(slug, title))}
      aria-label={isQueued ? "Remove from reading list" : "Add to reading list"}
      className="flex items-center gap-1.5 px-2.5 py-2 border border-obsidian-grey/20 text-obsidian-grey hover:text-aksum-black hover:border-aksum-black transition-colors flex-shrink-0"
    >
      {isQueued ? <BookmarkCheck size={14} className="text-aksum-gold" /> : <BookmarkPlus size={14} />}
    </button>
  );
}
