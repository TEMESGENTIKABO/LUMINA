"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2 } from "lucide-react";

interface NotificationItem { label: string; href: string; type: string }

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function load() {
      fetch("/api/admin/notifications").then((res) => res.json()).then((data) => setItems(data.items ?? []));
    }
    load();
    const interval = setInterval(load, 60000);
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
      <button
        onClick={() => setOpen(!open)}
        className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${open ? "bg-[#f5f4f2] text-[#1a1c23]" : "text-[#6b6f7a] hover:text-[#1a1c23] hover:bg-[#f5f4f2]"}`}
        aria-label="Notifications"
      >
        <Bell size={17} />
        {items.length > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-manuscript-red text-parchment-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-[#e5e3df] shadow-[0_20px_40px_-12px_rgba(26,28,35,0.2)] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0eeea]">
            <p className="font-headline-en text-sm font-semibold text-[#1a1c23]">Notifications</p>
            {items.length > 0 && <span className="font-ui text-xs text-[#8b8f99]">{items.length} new</span>}
          </div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <CheckCircle2 size={22} className="text-[#b8b5b0]" />
              <p className="font-ui text-sm text-[#8b8f99]">All caught up.</p>
            </div>
          ) : (
            <div className="flex flex-col p-1.5 max-h-80 overflow-y-auto">
              {items.map((item, i) => (
                <Link key={i} href={item.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl font-ui text-sm text-[#1a1c23] hover:bg-[#faf9f7] transition-colors">
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
