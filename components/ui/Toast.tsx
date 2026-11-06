"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; message: string; type: ToastType }

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.show;
}

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const colors = {
  success: "border-manuscript-red/30 text-manuscript-red",
  error: "border-manuscript-red text-manuscript-red bg-manuscript-red/5",
  info: "border-lalibela-blue/30 text-lalibela-blue",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-2.5 bg-parchment-white border shadow-lg px-4 py-3 font-ui text-sm animate-[toast-in_0.2s_ease-out] ${colors[t.type]}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="text-aksum-black">{t.message}</span>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-obsidian-grey/40 hover:text-obsidian-grey ml-1">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
