"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown } from "lucide-react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function AccountMenu({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  if (!mounted || status === "loading") {
    return <span className="inline-block h-8 w-14" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Link
        href={`/${locale}/sign-in`}
        className="font-ui text-[12px] font-semibold opacity-85 transition-opacity hover:opacity-100"
      >
        Sign in
      </Link>
    );
  }

  const initials = (session.user?.name ?? session.user?.email ?? "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isStaff = ["ADMIN", "EDITOR", "AUTHOR"].includes(
    (session.user as { role?: string } | undefined)?.role ?? "",
  );
  const item =
    "block px-4 py-2 font-ui text-sm text-obsidian-grey hover:bg-obsidian-grey/5 hover:text-aksum-black";

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 opacity-85 transition-opacity hover:opacity-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-aksum-gold text-[11px] font-bold text-[#12100d]">
          {initials}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-md border border-obsidian-grey/15 bg-parchment-white py-1 shadow-elevation">
          <p className="truncate border-b border-obsidian-grey/10 px-4 py-2.5 font-ui text-xs text-obsidian-grey">
            {session.user?.name ?? session.user?.email}
          </p>
          <Link
            href={`/${locale}/account`}
            onClick={() => setOpen(false)}
            className={item}
          >
            My Account
          </Link>
          <Link
            href={`/${locale}/account/saved`}
            onClick={() => setOpen(false)}
            className={item}
          >
            Saved Articles
          </Link>
          <Link
            href={`/${locale}/account/following`}
            onClick={() => setOpen(false)}
            className={item}
          >
            Following
          </Link>
          {isStaff && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 font-ui text-sm text-lalibela-blue hover:bg-obsidian-grey/5"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="w-full border-t border-obsidian-grey/10 px-4 py-2 text-left font-ui text-sm text-manuscript-red hover:bg-obsidian-grey/5"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
