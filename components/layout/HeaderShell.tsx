"use client";

import { useEffect, useRef, useState } from "react";

export function HeaderShell({
  children,
  below,
}: {
  children: React.ReactNode;
  below?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 160) setHidden(false);
      else if (delta > 8) setHidden(true);
      else if (delta < -8) setHidden(false);
      if (Math.abs(delta) > 8) lastY = y;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty(
        "--p",
        String(max > 0 ? Math.min(y / max, 1) : 0),
      );
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      // Keyboard users tabbing into the header should always see it.
      onFocusCapture={() => setHidden(false)}
      // The translate class is only applied while hidden, so no transform
      // is left behind to trap position:fixed children.
      className={`sticky top-0 z-50 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : ""
      }`}
    >
      <div className="relative bg-[#12100d] text-white">
        {children}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-aksum-gold"
          style={{ transform: "scaleX(var(--p, 0))" }}
        />
      </div>
      {below}
    </header>
  );
}
