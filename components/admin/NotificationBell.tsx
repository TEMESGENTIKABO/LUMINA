"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

interface NotificationItem { label: string; href: string; type: string }

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function load() {
      fetch("/api/admin/notifications")
        .then((res) => res.json())
        .then((data) => setItems(data.items ?? []));
    }
    load();
    const interval = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-[#6b6f7a] hover:text-[#1a1c23] transition-colors" aria-label="Notifications">
        <Bell size={16} />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-manuscript-red text-parchment-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-parchment-white border border-obsidian-grey/20 shadow-lg z-50">
          <p className="px-4 py-2.5 font-ui text-xs uppercase tracking-wide text-obsidian-grey border-b border-obsidian-grey/10">Notifications</p>
          {items.length === 0 ? (
            <p className="px-4 py-6 font-ui text-sm text-obsidian-grey text-center">All caught up.</p>
          ) : (
            <div className="flex flex-col">
              {items.map((item, i) => (
                <Link key={i} href={item.href} onClick={() => setOpen(false)} className="px-4 py-3 font-ui text-sm text-aksum-black hover:bg-obsidian-grey/5 border-b border-obsidian-grey/10 last:border-b-0">
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
