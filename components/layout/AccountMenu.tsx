"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";

export function AccountMenu({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (!mounted || status === "loading") {
    return <span className="w-16 h-4 inline-block" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Link href={`/${locale}/sign-in`} className="text-[11px] text-neutral-400 hover:text-white transition-colors">
        Sign In
      </Link>
    );
  }

  const initials = (session.user?.name ?? session.user?.email ?? "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isStaff = ["ADMIN", "EDITOR", "AUTHOR"].includes((session.user as any)?.role);

  return (
    <div ref={containerRef} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
        <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center">
          {initials}
        </span>
        <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-parchment-white border border-obsidian-grey/20 shadow-lg py-1 z-50">
          <p className="px-4 py-2 font-ui text-xs text-obsidian-grey truncate border-b border-obsidian-grey/10">
            {session.user?.name ?? session.user?.email}
          </p>
          <Link href={`/${locale}/account`} onClick={() => setOpen(false)} className="block px-4 py-2 font-ui text-sm text-obsidian-grey hover:bg-obsidian-grey/5 hover:text-aksum-black">
            My Account
          </Link>
          <Link href={`/${locale}/account/saved`} onClick={() => setOpen(false)} className="block px-4 py-2 font-ui text-sm text-obsidian-grey hover:bg-obsidian-grey/5 hover:text-aksum-black">
            Saved Articles
          </Link>
          <Link href={`/${locale}/account/following`} onClick={() => setOpen(false)} className="block px-4 py-2 font-ui text-sm text-obsidian-grey hover:bg-obsidian-grey/5 hover:text-aksum-black">
            Following
          </Link>
          {isStaff && (
            <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 font-ui text-sm text-lalibela-blue hover:bg-obsidian-grey/5">
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 font-ui text-sm text-manuscript-red hover:bg-obsidian-grey/5 border-t border-obsidian-grey/10"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
