"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { deleteOwnAccount } from "@/lib/actions/accountActions";

/** Same server action as before, but now you must type your email to confirm. */
export function DeleteAccountButton({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const phrase = email ?? "DELETE";
  const ok = typed.trim().toLowerCase() === phrase.toLowerCase();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !isPending && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, isPending]);

  function confirm() {
    if (!ok) return;
    setError("");
    startTransition(async () => {
      const result = await deleteOwnAccount();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setTyped(""); setError(""); setOpen(true); }}
        className="inline-flex h-11 items-center rounded-full border border-manuscript-red px-5 font-ui text-sm font-semibold text-manuscript-red transition duration-200 hover:bg-manuscript-red hover:text-parchment-white active:scale-[.98]"
      >
        Delete my account
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <div className="acct-fade absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isPending && setOpen(false)} />
            <div role="alertdialog" aria-modal="true" aria-labelledby="del-title"
              className="acct-pop relative w-full max-w-md rounded-3xl bg-parchment-white p-6 shadow-2xl">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-manuscript-red/10 text-manuscript-red">
                <AlertTriangle size={22} />
              </span>
              <h2 id="del-title" className="font-serif text-2xl font-semibold text-aksum-black">Delete your account?</h2>
              <p className="mt-2 font-ui text-sm text-obsidian-grey/80">
                This permanently removes your profile, saved stories and preferences, and cancels any active membership. It can&apos;t be undone.
              </p>
              <label className="mt-5 block font-ui text-xs font-semibold uppercase tracking-wide text-obsidian-grey/70">
                Type <span className="normal-case text-aksum-black">{phrase}</span> to confirm
                <input ref={inputRef} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false}
                  className="mt-1.5 h-12 w-full rounded-xl border border-obsidian-grey/25 bg-transparent px-4 text-sm normal-case tracking-normal text-aksum-black outline-none focus:border-manuscript-red focus:ring-2 focus:ring-manuscript-red/20" />
              </label>
              {error && <p className="mt-3 font-ui text-xs text-manuscript-red">{error}</p>}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setOpen(false)} disabled={isPending}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-obsidian-grey/30 px-5 font-ui text-sm font-semibold text-aksum-black hover:border-aksum-black disabled:opacity-50">
                  Keep my account
                </button>
                <button type="button" onClick={confirm} disabled={!ok || isPending}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-manuscript-red px-5 font-ui text-sm font-semibold text-parchment-white transition active:scale-[.98] disabled:opacity-40">
                  {isPending ? "Deleting…" : "Permanently delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
