"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface FilterOption { id: string; label: string }

export function ArticlesFilterBar({
  categories,
  authors,
}: {
  categories: FilterOption[];
  authors: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // reset to page 1 on any filter change
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles..."
          className="border border-obsidian-grey/20 px-3 py-1.5 font-ui text-sm bg-parchment-white w-full"
        />
      </form>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="border border-obsidian-grey/20 px-3 py-1.5 font-ui text-sm bg-parchment-white"
      >
        <option value="">All statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>

      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="border border-obsidian-grey/20 px-3 py-1.5 font-ui text-sm bg-parchment-white"
      >
        <option value="">All categories</option>
        {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
      </select>

      <select
        defaultValue={searchParams.get("author") ?? ""}
        onChange={(e) => updateParam("author", e.target.value)}
        className="border border-obsidian-grey/20 px-3 py-1.5 font-ui text-sm bg-parchment-white"
      >
        <option value="">All authors</option>
        {authors.map((a) => (<option key={a.id} value={a.id}>{a.label}</option>))}
      </select>

      {(searchParams.get("q") || searchParams.get("status") || searchParams.get("category") || searchParams.get("author")) && (
        <button
          onClick={() => { setQ(""); router.push(pathname); }}
          className="font-ui text-xs text-obsidian-grey hover:text-manuscript-red"
        >
          Clear filters
        </button>
      )}
      {isPending && <span className="font-ui text-xs text-obsidian-grey/50">Loading...</span>}
    </div>
  );
}
