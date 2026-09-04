"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollAwareBar({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`transition-[max-height,opacity] duration-200 overflow-hidden ${hidden ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
      {children}
    </div>
  );
}
