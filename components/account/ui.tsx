"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/* ---------- toasts ---------- */
type Toast = { id: number; msg: string; kind: "ok" | "err" };
const ToastCtx = createContext<(msg: string, kind?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const seq = useRef(0);
  const push = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = ++seq.current;
    setList((l) => [...l.slice(-2), { id, msg, kind }]);
    window.setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[95] flex flex-col items-center gap-2 px-4 pb-[env(safe-area-inset-bottom)]"
      >
        {list.map((t) => (
          <div
            key={t.id}
            className={`acct-toast pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 font-ui text-sm shadow-lg ${
              t.kind === "ok" ? "bg-aksum-black text-parchment-white" : "bg-manuscript-red text-parchment-white"
            }`}
          >
            {t.kind === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- primitives ---------- */
export const inputCls =
  "h-12 w-full rounded-xl border border-obsidian-grey/25 bg-transparent px-4 font-ui text-sm text-aksum-black outline-none transition focus:border-aksum-black focus:ring-2 focus:ring-aksum-black/15 disabled:opacity-60";

export function btnCls(variant: "primary" | "outline" | "danger" | "ghost" = "primary") {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 font-ui text-sm font-semibold transition duration-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";
  const v = {
    primary: "bg-aksum-black text-parchment-white hover:opacity-90",
    outline: "border border-obsidian-grey/30 text-aksum-black hover:border-aksum-black",
    ghost: "text-obsidian-grey hover:bg-obsidian-grey/10",
    danger: "border border-manuscript-red text-manuscript-red hover:bg-manuscript-red hover:text-parchment-white",
  }[variant];
  return `${base} ${v}`;
}

export function Btn({
  variant = "primary",
  className = "",
  ...p
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "danger" | "ghost" }) {
  return <button type="button" {...p} className={`${btnCls(variant)} ${className}`} />;
}

export function Card({ children, className = "", danger = false }: { children: ReactNode; className?: string; danger?: boolean }) {
  return (
    <section
      className={`rounded-2xl border bg-parchment-white p-5 sm:p-6 ${
        danger ? "border-manuscript-red/30" : "border-obsidian-grey/15"
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHead({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-aksum-black sm:text-3xl">{title}</h2>
        {desc && <p className="mt-1 max-w-xl font-ui text-sm text-obsidian-grey/80">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between font-ui text-xs font-semibold uppercase tracking-wide text-obsidian-grey/70">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Switch({
  checked, onChange, label, desc, disabled,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string; disabled?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-ui text-sm font-semibold text-aksum-black">{label}</p>
        {desc && <p className="mt-0.5 font-ui text-xs text-obsidian-grey/70">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 flex-none rounded-full transition-colors duration-300 disabled:opacity-50 ${
          checked ? "bg-aksum-black" : "bg-obsidian-grey/25"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-parchment-white shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-obsidian-grey/25 px-6 py-12 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-obsidian-grey/10 text-obsidian-grey">{icon}</span>
      <p className="font-serif text-lg font-semibold text-aksum-black">{title}</p>
      {text && <p className="mt-1 max-w-sm font-ui text-sm text-obsidian-grey/80">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="acct-sk h-20 rounded-2xl" />
      ))}
    </div>
  );
}

export const LocalNote = () => (
  <p className="mt-4 rounded-xl bg-obsidian-grey/10 px-4 py-3 font-ui text-xs text-obsidian-grey/80">
    Account sync isn&apos;t switched on yet, so this is saved on this device only.
  </p>
);
