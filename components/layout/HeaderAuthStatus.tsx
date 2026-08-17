"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function HeaderAuthStatus({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="w-20 h-4 bg-neutral-700/20 rounded animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href={`/${locale}/sign-in`}
        className="text-neutral-500 hover:text-parchment-white transition-colors duration-200 text-[11px] font-ui font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-manuscript-red/50 rounded-sm px-1"
      >
        Sign In
      </Link>
    );
  }

  const userInitial =
    session.user?.name?.[0] || session.user?.email?.[0] || "U";
  const userName = session.user?.name || session.user?.email || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 text-neutral-500 hover:text-parchment-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-manuscript-red/50 rounded-sm px-1 py-0.5"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
      >
        <span className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-parchment-white border border-neutral-600">
          {userInitial.toUpperCase()}
        </span>
        <span className="hidden sm:block text-[11px] font-ui font-medium tracking-wide max-w-[80px] truncate">
          Account
        </span>
      </button>

      <div
        className={`
          absolute right-0 top-full mt-2 w-48
          bg-parchment-white border border-hairline
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]
          rounded-xl py-2 z-50 origin-top-right
          transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            dropdownOpen
              ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
              : "opacity-0 scale-95 pointer-events-none -translate-y-1"
          }
        `}
      >
        <div className="px-4 py-2 border-b border-hairline/50 mb-1">
          <p className="text-xs font-ui font-semibold text-aksum-black truncate">
            {userName}
          </p>
          <p className="text-[11px] font-ui text-obsidian-grey/60 truncate">
            {session.user?.email}
          </p>
        </div>

        <Link
          href={`/${locale}/account`}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-ui text-obsidian-grey hover:text-aksum-black hover:bg-aksum-black/[0.03] transition-colors duration-150 rounded-lg mx-1"
          onClick={() => setDropdownOpen(false)}
        >
          <Settings size={14} className="opacity-60" />
          Account Settings
        </Link>
        <button
          onClick={() => {
            setDropdownOpen(false);
            signOut();
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-ui text-obsidian-grey hover:text-manuscript-red hover:bg-manuscript-red/5 transition-colors duration-150 rounded-lg mx-1"
        >
          <LogOut size={14} className="opacity-60" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
