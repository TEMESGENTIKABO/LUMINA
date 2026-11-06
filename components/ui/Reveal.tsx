"use client";

import { useEffect, useRef, useState } from "react";

// Fades a section in as it scrolls into view. Content stays visible without
// JavaScript and for anything already on screen at load.
export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes =
    state === "hidden"
      ? "opacity-0 translate-y-6"
      : state === "shown"
        ? "opacity-100 translate-y-0 transition-all duration-500 ease-out"
        : "";

  return <div ref={ref} className={classes}>{children}</div>;
}
