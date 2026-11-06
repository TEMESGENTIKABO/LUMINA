"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, BookMarked } from "lucide-react";

interface QueuedArticle { slug: string; title: string; addedAt: number }

const STORAGE_KEY = "aksum-reading-list";

export function useReadingList() {
  const [list, setList] = useState<QueuedArticle[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setList(JSON.parse(stored));
  }, []);

  function add(slug: string, title: string) {
    setList((prev) => {
      if (prev.some((a) => a.slug === slug)) return prev;
      const next = [...prev, { slug, title, addedAt: Date.now() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function remove(slug: string) {
    setList((prev) => {
      const next = prev.filter((a) => a.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return { list, add, remove };
}

export function ReadingListDrawer({ locale }: { locale: string }) {
  const { list, remove } = useReadingList();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-aksum-black text-parchment-white shadow-lg flex items-center justify-center hover:bg-manuscript-red transition-colors"
        aria-label="Reading list"
      >
        <BookMarked size={18} />
        {list.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-aksum-gold text-aksum-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {list.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-aksum-black/40" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-parchment-white flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-14 hairline-b flex-shrink-0">
              <p className="font-headline-en text-lg">Reading List</p>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {list.length === 0 ? (
                <p className="font-ui text-sm text-obsidian-grey">
                  Nothing queued yet. Use the bookmark icon on any article to add it here.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-hairline">
                  {list.map((item) => (
                    <div key={item.slug} className="flex items-center justify-between gap-3 py-3">
                      <Link href={`/${locale}/article/${item.slug}`} onClick={() => setOpen(false)} className="font-body-en text-sm hover:text-manuscript-red flex-1">
                        {item.title}
                      </Link>
                      <button onClick={() => remove(item.slug)} className="font-ui text-xs text-obsidian-grey hover:text-manuscript-red flex-shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
