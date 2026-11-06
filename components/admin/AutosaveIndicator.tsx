"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export function useAutosave(articleId: string | undefined, data: { title_en: string; dek_en: string; body_en: object }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    if (!articleId) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!dataRef.current.title_en.trim()) return; // don't autosave an empty title over real content
      setStatus("saving");
      try {
        await fetch("/api/admin/autosave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, ...dataRef.current }),
        });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("idle");
      }
    }, 5000);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [articleId, data.title_en, data.dek_en, JSON.stringify(data.body_en)]);

  return status;
}

export function AutosaveIndicator({ status }: { status: "idle" | "saving" | "saved" }) {
  if (status === "idle") return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f4f2] px-2.5 py-1 font-ui text-xs text-[#6b6f7a]">
      {status === "saving" ? (
        <><Loader2 size={12} className="animate-spin" /> Saving...</>
      ) : (
        <><Check size={12} className="text-[#4a7c6b]" /> Saved</>
      )}
    </span>
  );
}
