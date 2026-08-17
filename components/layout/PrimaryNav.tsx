"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { primaryNav } from "@/config/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PrimaryNavProps {
  locale: string;
  activeSlug?: string;
}

export function PrimaryNav({ locale, activeSlug }: PrimaryNavProps) {
  const t = useTranslations();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setHoveredIndex(null);
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setHoveredIndex(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const handleMouseEnter = (slug: string, hasSubItems: boolean, index: number) => {
    if (!hasSubItems) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredIndex(index);
    setOpenDropdown(slug);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setOpenDropdown(null);
    }, 150);
  };

  const toggleDropdown = (slug: string) => {
    setOpenDropdown(openDropdown === slug ? null : slug);
  };

  const isOpen = (slug: string) => openDropdown === slug;

  return (
    <nav
      ref={navRef}
      className="relative flex items-center justify-center h-16 px-2"
      role="navigation"
      aria-label="Primary"
    >
      {/* Decorative background line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-hairline to-transparent" />

      {primaryNav.map((item, index) => {
        const isActive = activeSlug === item.slug;
        const hasSubItems = !!item.subItems?.length;
        const isDropdownOpen = isOpen(item.slug);
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={item.slug}
            className="relative h-full flex items-center mx-0.5"
            onMouseEnter={() => handleMouseEnter(item.slug, hasSubItems, index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/${locale}/${item.slug}`}
              className={`
                group relative px-4 h-full flex items-center gap-1.5
                font-ui text-sm font-medium tracking-wide
                transition-all duration-300 ease-out
                ${isActive 
                  ? "text-manuscript-red" 
                  : "text-obsidian-grey hover:text-aksum-black"
                }
                ${hasSubItems ? "pr-3" : ""}
                ${isHovered ? "scale-[1.02]" : ""}
              `}
              aria-current={isActive ? "page" : undefined}
              aria-expanded={hasSubItems ? isDropdownOpen : undefined}
              aria-haspopup={hasSubItems ? "true" : undefined}
              onClick={(e) => {
                if (hasSubItems) {
                  e.preventDefault();
                  toggleDropdown(item.slug);
                }
              }}
              onKeyDown={(e) => {
                if (hasSubItems && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  toggleDropdown(item.slug);
                }
              }}
            >
              {/* Hover background effect */}
              <span className={`
                absolute inset-0 rounded-lg transition-all duration-300
                ${isHovered || isDropdownOpen 
                  ? "bg-aksum-black/[0.04] scale-100" 
                  : "bg-transparent scale-95"
                }
              `} />

              <span className="relative z-10">{t(item.labelKey)}</span>

              {hasSubItems && (
                <ChevronDown
                  size={15}
                  className={`
                    relative z-10 transition-all duration-300 ease-out
                    ${isDropdownOpen 
                      ? "rotate-180 text-manuscript-red" 
                      : "opacity-60 group-hover:opacity-100"
                    }
                  `}
                  aria-hidden="true"
                />
              )}

              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-manuscript-red rounded-full" />
              )}

              {/* Hover indicator */}
              {!isActive && (isHovered || isDropdownOpen) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-aksum-black/20 rounded-full transition-all duration-300" />
              )}
            </Link>

            {hasSubItems && (
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 top-full pt-2
                  transition-all duration-300 ease-out z-50
                  ${isDropdownOpen 
                    ? "opacity-100 translate-y-0 pointer-events-auto scale-100" 
                    : "opacity-0 -translate-y-2 pointer-events-none scale-95"
                  }
                `}
                role="menu"
              >
                <div className="
                  relative min-w-[240px] py-2
                  bg-white/90 backdrop-blur-xl
                  border border-hairline
                  shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]
                  rounded-2xl
                  overflow-hidden
                ">
                  {/* Decorative gradient top */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-manuscript-red/30 to-transparent" />

                  {item.subItems!.map((sub, subIndex) => (
                    <Link
                      key={sub.path}
                      href={`/${locale}/${sub.path}`}
                      className="
                        group/sub relative block px-5 py-3
                        transition-all duration-200
                        hover:pl-7
                      "
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <span className="
                        relative z-10 flex items-center gap-3
                        font-ui text-sm text-obsidian-grey
                        transition-colors duration-200
                        group-hover/sub:text-aksum-black
                      ">
                        {/* Bullet point decoration */}
                        <span className="
                          w-1 h-1 rounded-full bg-manuscript-red/30
                          transition-all duration-200
                          group-hover/sub:bg-manuscript-red group-hover/sub:scale-150
                        " />
                        {sub.label}
                      </span>

                      {/* Hover background */}
                      <span className="
                        absolute inset-x-2 inset-y-0.5 rounded-lg
                        bg-aksum-black/[0.03]
                        transition-all duration-200
                        opacity-0 group-hover/sub:opacity-100
                      " />
                    </Link>
                  ))}

                  {/* Subtle divider between items */}
                  {item.subItems!.map((_, subIndex) => (
                    subIndex < item.subItems!.length - 1 && (
                      <div key={`divider-${subIndex}`} className="mx-4 h-px bg-hairline/50" />
                    )
                  ))}
                </div>

                {/* Small caret/triangle indicator */}
                <div
                  className={`
                    absolute -top-0.5 left-1/2 -translate-x-1/2
                    w-3 h-3 rotate-45
                    bg-white/90 backdrop-blur-xl
                    border-l border-t border-hairline
                    transition-all duration-300
                    opacity-0 scale-75
                    ${isDropdownOpen ? "opacity-100 scale-100" : ""}
                  `}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}