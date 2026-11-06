"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  d: "/admin",
  a: "/admin/articles",
  n: "/admin/articles/new",
  k: "/admin/kanban",
  m: "/admin/media",
  c: "/admin/calendar",
};

export function AdminKeyboardShortcuts() {
  const router = useRouter();
  const [pendingG, setPendingG] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = ["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
      if (isTyping) return;

      if (e.key === "g" && !pendingG) {
        setPendingG(true);
        timeout = setTimeout(() => setPendingG(false), 1000);
        return;
      }

      if (pendingG && ROUTES[e.key]) {
        e.preventDefault();
        router.push(ROUTES[e.key]);
        setPendingG(false);
        clearTimeout(timeout);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, [pendingG, router]);

  return null;
}
