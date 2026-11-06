"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[90] bg-aksum-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-parchment-white border border-obsidian-grey/20 shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto animate-[toast-in_0.15s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-obsidian-grey/10 flex-shrink-0">
          <h2 id="modal-title" className="font-headline-en text-lg">{title}</h2>
          <button ref={closeButtonRef} onClick={onClose} aria-label="Close" className="text-obsidian-grey hover:text-aksum-black p-1">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
