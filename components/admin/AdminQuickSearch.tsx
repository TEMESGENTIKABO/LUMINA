"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Results {
  articles: { id: string; title_en: string; status: string }[];
  users: { id: string; name: string | null; email: string | null }[];
  media: { id: string; filename: string; url: string }[];
}

export function AdminQuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/admin/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

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
      <div className="flex items-center gap-2 border border-obsidian-grey/20 px-3 py-1.5">
        <Search size={14} className="text-obsidian-grey" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Quick search..."
          className="font-ui text-sm bg-transparent outline-none w-48"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute top-full mt-1 left-0 w-80 bg-parchment-white border border-obsidian-grey/20 shadow-lg z-50 max-h-96 overflow-y-auto">
          {!hasResults ? (
            <p className="font-ui text-sm text-obsidian-grey p-4">No results.</p>
          ) : (
            <>
              {results!.articles.length > 0 && (
                <div className="p-2">
                  <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/50 px-2 mb-1">Articles</p>
                  {results!.articles.map((a) => (
                    <Link key={a.id} href={`/admin/articles/${a.id}`} onClick={() => setOpen(false)} className="block px-2 py-1.5 font-ui text-sm hover:bg-obsidian-grey/5">
                      {a.title_en} <span className="text-xs text-obsidian-grey/50">({a.status})</span>
                    </Link>
                  ))}
                </div>
              )}
              {results!.users.length > 0 && (
                <div className="p-2 border-t border-obsidian-grey/10">
                  <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/50 px-2 mb-1">Users</p>
                  {results!.users.map((u) => (
                    <Link key={u.id} href="/admin/users" onClick={() => setOpen(false)} className="block px-2 py-1.5 font-ui text-sm hover:bg-obsidian-grey/5">
                      {u.name ?? u.email}
                    </Link>
                  ))}
                </div>
              )}
              {results!.media.length > 0 && (
                <div className="p-2 border-t border-obsidian-grey/10">
                  <p className="font-ui text-[10px] uppercase tracking-wide text-obsidian-grey/50 px-2 mb-1">Media</p>
                  {results!.media.map((m) => (
                    <Link key={m.id} href="/admin/media" onClick={() => setOpen(false)} className="block px-2 py-1.5 font-ui text-sm hover:bg-obsidian-grey/5">
                      {m.filename}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
