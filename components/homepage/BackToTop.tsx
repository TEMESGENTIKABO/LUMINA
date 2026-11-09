"use client";

import "./home-next.css";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop({ label = "Back to top" }: { label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`hn-top${show ? " is-on" : ""}`}
      aria-label={label}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
    >
      <ArrowUp size={18} aria-hidden />
    </button>
  );
}
