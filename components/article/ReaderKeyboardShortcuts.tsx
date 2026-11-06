"use client";

import { useEffect } from "react";

export function ReaderKeyboardShortcuts({ onNextArticle, onSave }: { onNextArticle?: () => void; onSave?: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable) return;

      if (e.key === "j" && onNextArticle) onNextArticle();
      if (e.key === "s" && onSave) onSave();
      if (e.key === "Escape") window.speechSynthesis?.cancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNextArticle, onSave]);

  return null;
}
