"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconBrandWhatsapp, IconBrandTelegram, IconBrandX, IconMail, IconMessageCircle, IconX } from "@tabler/icons-react";

const CONTACT_OPTIONS = [
  { label: "WhatsApp", href: "https://wa.me/251912345678", icon: IconBrandWhatsapp },
  { label: "Telegram", href: "https://t.me/aksummedia", icon: IconBrandTelegram },
  { label: "X", href: "https://x.com/aksummedia", icon: IconBrandX },
  { label: "Email", href: "mailto:contact@aksum.media", icon: IconMail },
];

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus?: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close(true);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <div
      ref={rootRef}
      className="fixed right-5 bottom-5 sm:right-6 sm:bottom-6 z-40 flex flex-col items-end gap-2.5"
    >
      <div
        role="menu"
        aria-label="Contact options"
        hidden={!open}
        className={`flex flex-col items-end gap-2 transition-all duration-200 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {CONTACT_OPTIONS.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            role="menuitem"
            onClick={() => close()}
            className="
              flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full
              bg-aksum-black text-parchment-white text-[13px] font-medium
              shadow-[0_6px_16px_-4px_rgba(10,10,10,0.35)]
              hover:bg-aksum-black/90 transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold
            "
          >
            {label}
            <span className="w-7 h-7 rounded-full bg-lalibela-blue flex items-center justify-center shrink-0">
              <Icon size={14} className="text-parchment-white" />
            </span>
          </a>
        ))}
      </div>

      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "Open contact options"}
        onClick={() => setOpen((v) => !v)}
        className="
          w-[52px] h-[52px] rounded-full bg-aksum-gold
          shadow-[0_8px_20px_-2px_rgba(201,162,75,0.5)]
          flex items-center justify-center
          transition-transform duration-150 hover:scale-105 active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-black focus-visible:ring-offset-2
        "
      >
        {open ? (
          <IconX size={22} className="text-aksum-black" />
        ) : (
          <IconMessageCircle size={22} className="text-aksum-black" />
        )}
      </button>
    </div>
  );
}