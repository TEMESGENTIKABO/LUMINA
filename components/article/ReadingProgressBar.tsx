"use client";

import { useEffect, useRef } from "react";

export function ReadingProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-black/5"
      aria-hidden="true"
    >
      <div
        ref={bar}
        className="h-full origin-left"
        style={{
          background: "var(--hp-bandacc, #c79a45)",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
