"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, FileText, User, Image as ImageIcon } from "lucide-react";

interface Results {
  articles: { id: string; title_en: string; status: string }[];
  users: { id: string; name: string | null; email: string | null }[];
  media: { id: string; filename: string; url: string }[];
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-2 [&:not(:first-child)]:border-t border-[#f0eeea]">
      <p className="font-ui text-[10px] font-semibold uppercase tracking-wider text-[#a5a39e] px-2.5 py-1.5">{label}</p>
      {children}
    </div>
  );
}

const rowCls = "flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-ui text-sm text-[#1a1c23] hover:bg-[#faf9f7] transition-colors";

export function AdminQuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;
    const timeout = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(query)}`).then((res) => res.json()).then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) setResults(null);
    setOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results && (results.articles.length > 0 || results.users.length > 0 || results.media.length > 0);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2.5 rounded-xl bg-[#f5f4f2] border border-transparent px-3.5 py-2 focus-within:bg-white focus-within:border-[#c9a227]/50 focus-within:ring-4 focus-within:ring-[#c9a227]/10 transition-all">
        <Search size={15} className="text-[#8b8f99]" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search articles, users, media…"
          className="font-ui text-sm bg-transparent outline-none w-56 xl:w-72 placeholder:text-[#a5a39e]"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 w-96 bg-white rounded-2xl border border-[#e5e3df] shadow-[0_20px_40px_-12px_rgba(26,28,35,0.2)] z-50 max-h-96 overflow-y-auto">
          {!hasResults ? (
            <p className="font-ui text-sm text-[#8b8f99] p-6 text-center">No results.</p>
          ) : (
            <>
              {results!.articles.length > 0 && (
                <Group label="Articles">
                  {results!.articles.map((a) => (
                    <Link key={a.id} href={`/admin/articles/${a.id}`} onClick={() => setOpen(false)} className={rowCls}>
                      <FileText size={14} className="text-[#a5a39e] flex-shrink-0" />
                      <span className="truncate flex-1">{a.title_en}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#8b8f99] bg-[#f5f4f2] px-1.5 py-0.5 rounded-full">{a.status}</span>
                    </Link>
                  ))}
                </Group>
              )}
              {results!.users.length > 0 && (
                <Group label="Users">
                  {results!.users.map((u) => (
                    <Link key={u.id} href="/admin/users" onClick={() => setOpen(false)} className={rowCls}>
                      <User size={14} className="text-[#a5a39e] flex-shrink-0" />
                      <span className="truncate">{u.name ?? u.email}</span>
                    </Link>
                  ))}
                </Group>
              )}
              {results!.media.length > 0 && (
                <Group label="Media">
                  {results!.media.map((m) => (
                    <Link key={m.id} href="/admin/media" onClick={() => setOpen(false)} className={rowCls}>
                      <ImageIcon size={14} className="text-[#a5a39e] flex-shrink-0" />
                      <span className="truncate">{m.filename}</span>
                    </Link>
                  ))}
                </Group>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
