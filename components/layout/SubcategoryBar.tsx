"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubcategoryItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface SubcategoryBarProps {
  items: SubcategoryItem[];
  title?: string;
}

export function SubcategoryBar({ items, title }: SubcategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div className="max-w-page mx-auto relative">
        {/* Left fade */}
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none
            bg-gradient-to-r from-parchment-white to-transparent
            transition-opacity duration-200
            ${canScrollLeft ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Right fade */}
        <div
          className={`
            absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none
            bg-gradient-to-l from-parchment-white to-transparent
            transition-opacity duration-200
            ${canScrollRight ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className={`
            hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
            w-7 h-7 items-center justify-center
            bg-parchment-white border border-hairline rounded-full shadow-sm
            hover:border-aksum-black/20 hover:shadow-md
            transition-all duration-200
            ${
              canScrollLeft
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none"
            }
          `}
          aria-label="Scroll left"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => scroll("right")}
          className={`
            hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
            w-7 h-7 items-center justify-center
            bg-parchment-white border border-hairline rounded-full shadow-sm
            hover:border-aksum-black/20 hover:shadow-md
            transition-all duration-200
            ${
              canScrollRight
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }
          `}
          aria-label="Scroll right"
        >
          <ChevronRight size={14} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 h-12 overflow-x-auto scrollbar-hide py-1.5 px-1 lg:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {title && (
            <span className="shrink-0 font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-manuscript-red mr-2">
              {title}
            </span>
          )}

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                shrink-0 px-4 py-1.5 rounded-full font-ui text-[13px] font-medium
                transition-all duration-200
                ${
                  item.isActive
                    ? "bg-aksum-black text-parchment-white shadow-sm"
                    : "text-obsidian-grey hover:bg-aksum-black/[0.05] hover:text-aksum-black"
                }
              `}
              aria-current={item.isActive ? "location" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
