"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Check,
  Copy,
  LayoutGrid,
  List,
  Maximize2,
  Search,
  X,
} from "lucide-react";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";
import { deleteMedia, bulkDeleteMedia } from "@/lib/admin/actions/mediaActions";
import { ui, tabsCls, tabCls } from "./ui";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  createdAt?: Date | string;
}

export function MediaGrid({
  items,
  mode = "browse",
  onSelect,
}: {
  items: MediaItem[];
  mode?: "browse" | "picker";
  onSelect?: (url: string) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const shown = useMemo(
    () =>
      items.filter((i) =>
        i.filename.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [items, q],
  );

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const allOn = shown.length > 0 && shown.every((i) => selected.includes(i.id));
  const click = (item: MediaItem) =>
    mode === "picker" ? onSelect?.(item.url) : toggle(item.id);

  async function copy(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(
        new URL(item.url, window.location.origin).href,
      );
      setCopied(item.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  async function bulkDelete() {
    if (!confirming) return setConfirming(true);
    setError("");
    const result = await bulkDeleteMedia(selected);
    if (result.error) setError(result.error);
    else {
      setSelected([]);
      router.refresh();
    }
    setConfirming(false);
  }

  if (items.length === 0) {
    return (
      <div
        className={`${ui.card} px-5 py-12 text-center text-sm text-[#6b665c]`}
      >
        <b className="block text-[#12100d]">No media yet</b>
        Uploaded images will appear here.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-sm flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-3 text-[#6b665c]"
          />
          <input
            className={`${ui.input} pl-10`}
            placeholder="Search filenames…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <span className="text-[13px] text-[#6b665c]">
          {shown.length} of {items.length}
        </span>
        <div className={`${tabsCls} ml-auto`}>
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={tabCls(view === "grid")}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            className={tabCls(view === "list")}
            onClick={() => setView("list")}
          >
            <List size={15} />
          </button>
        </div>
        {mode === "browse" && (
          <button
            type="button"
            className={ui.btn}
            onClick={() => setSelected(allOn ? [] : shown.map((i) => i.id))}
          >
            {allOn ? "Clear selection" : "Select all"}
          </button>
        )}
      </div>

      {mode === "browse" && selected.length > 0 && (
        <div className="sticky top-20 z-30 mb-4 flex items-center gap-3 rounded-2xl bg-aksum-black px-4 py-3 text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]">
          <div className="flex-1 text-[13.5px]">
            <b>{selected.length}</b> selected
            {error && <span className="ml-2 text-[#ffb4b4]">· {error}</span>}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected([]);
              setConfirming(false);
            }}
            className="h-9 rounded-[10px] border border-white/20 px-3.5 text-sm font-semibold transition hover:bg-white/10"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={bulkDelete}
            className={`h-9 rounded-[10px] px-4 text-sm font-bold transition ${confirming ? "bg-[#d64545] text-white" : "bg-[#c79a45] text-[#1a1405] hover:brightness-110"}`}
          >
            {confirming ? "Confirm delete" : "Delete selected"}
          </button>
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
          {shown.map((item) => {
            const on = mode === "browse" && selected.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#e6e1d6] bg-[#ece7da]"
              >
                <button
                  type="button"
                  aria-label={item.filename}
                  onClick={() => click(item)}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </button>
                {on && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-[3px] ring-inset ring-[#c79a45]" />
                )}
                {mode === "browse" && (
                  <button
                    type="button"
                    aria-label="Select"
                    onClick={() => toggle(item.id)}
                    className={`absolute left-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-md border-2 transition focus-visible:opacity-100 group-hover:opacity-100 ${
                      on
                        ? "border-[#c79a45] bg-[#c79a45] text-[#1a1405] opacity-100"
                        : "border-white bg-black/25 text-white opacity-0"
                    }`}
                  >
                    {on && <Check size={14} />}
                  </button>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-1.5 bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-7 text-[11.5px] text-white opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
                  <span className="min-w-0 truncate">{item.filename}</span>
                  <span className="pointer-events-auto flex flex-none gap-1">
                    <button
                      type="button"
                      title="Preview"
                      className={ui.iconBtn}
                      onClick={() => setPreview(item)}
                    >
                      <Maximize2 size={13} />
                    </button>
                    <button
                      type="button"
                      title="Copy URL"
                      className={ui.iconBtn}
                      onClick={() => copy(item)}
                    >
                      {copied === item.id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                    {mode === "browse" && (
                      <ConfirmDeleteButton
                        itemName={item.filename}
                        onDelete={() => deleteMedia(item.id)}
                      />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className={`${ui.card} divide-y divide-[#f0ece1]`}>
          {shown.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3.5 px-5 py-3 transition hover:bg-[#faf8f3]"
            >
              {mode === "browse" && (
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#c79a45]"
                  checked={selected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                  aria-label={`Select ${item.filename}`}
                />
              )}
              <button
                type="button"
                onClick={() => click(item)}
                className="relative h-11 w-11 flex-none overflow-hidden rounded-[10px]"
              >
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </button>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {item.filename}
                </span>
                {item.createdAt && (
                  <span className="text-xs text-[#6b665c]">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={`${ui.btn} !h-9`}
                onClick={() => copy(item)}
              >
                {copied === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copied === item.id ? "Copied" : "Copy URL"}
              </button>
              {mode === "browse" && (
                <ConfirmDeleteButton
                  itemName={item.filename}
                  onDelete={() => deleteMedia(item.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {shown.length === 0 && (
        <div
          className={`${ui.card} px-5 py-10 text-center text-sm text-[#6b665c]`}
        >
          No files match “{q}”.
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-6 backdrop-blur-md"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPreview(null)}
            className={`${ui.iconBtn} absolute right-5 top-5 !h-9 !w-9`}
          >
            <X size={16} />
          </button>
          <div
            className="relative h-[82vh] w-full max-w-[1100px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={preview.url}
              alt={preview.filename}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
