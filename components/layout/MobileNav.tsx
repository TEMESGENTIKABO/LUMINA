"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { LanguageToggle } from "./LanguageToggle";
import { DarkModeToggle } from "./DarkModeToggle";

interface NavSubItem {
  label: string;
  path: string;
}
interface NavItem {
  label: string;
  slug: string;
  subItems?: NavSubItem[];
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function MobileNav({
  locale,
  items,
  searchLabel,
}: {
  locale: string;
  items: NavItem[];
  searchLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const close = useCallback(() => setOpen(false), []);

  // Lock page scroll behind the drawer; Escape closes it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const quick =
    "py-2 font-ui text-[15px] text-white/70 transition-colors hover:text-white";

  const drawer = (
    <div
      className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      inert={!open}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 left-0 flex w-[min(88vw,400px)] flex-col bg-[#12100d] text-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Wordmark locale={locale} />
          <button
            onClick={close}
            aria-label="Close menu"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-5">
          <Link
            href={`/${locale}/search`}
            onClick={close}
            className="flex h-11 items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 font-ui text-sm text-white/60"
          >
            <Search size={16} />
            {searchLabel}
          </Link>

          <div className="mt-3">
            {items.map((item) => (
              <div key={item.slug} className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/${item.slug}`}
                    onClick={close}
                    className="flex-1 py-4 font-headline-en text-[1.65rem] font-semibold leading-none"
                  >
                    {item.label}
                  </Link>
                  {item.subItems && (
                    <button
                      onClick={() =>
                        setExpanded(expanded === item.slug ? null : item.slug)
                      }
                      aria-label={`Expand ${item.label}`}
                      aria-expanded={expanded === item.slug}
                      className="-mr-2 p-3 text-white/60"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${expanded === item.slug ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>
                {item.subItems && expanded === item.slug && (
                  <div className="grid grid-cols-2 gap-x-4 pb-4">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        href={`/${locale}/${sub.path}`}
                        onClick={close}
                        className={quick}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4">
            <Link
              href={`/${locale}/todays-paper`}
              onClick={close}
              className={quick}
            >
              Today&apos;s Paper
            </Link>
            <Link
              href={`/${locale}/newsletters`}
              onClick={close}
              className={quick}
            >
              Newsletters
            </Link>
            <Link href={`/${locale}/topics`} onClick={close} className={quick}>
              All Topics
            </Link>
            <Link href={`/${locale}/events`} onClick={close} className={quick}>
              Events
            </Link>
          </div>

          {/* The two toggles are styled for a light bar, so force light-on-dark here. */}
          <div className="mt-4 flex items-center gap-6 border-t border-white/10 pt-4 [&_a]:text-white/80! [&_button]:text-white/80!">
            <LanguageToggle currentLocale={locale} />
            <DarkModeToggle />
            <Link
              href={`/${locale}/account`}
              onClick={close}
              className="font-ui text-[13px] font-semibold text-white/80"
            >
              Account
            </Link>
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-white/10 p-6">
          <Link
            href={`/${locale}/membership`}
            onClick={close}
            className="flex h-12 items-center justify-center rounded-full bg-aksum-gold font-ui text-sm font-bold text-[#12100d]"
          >
            Subscribe
          </Link>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Menu size={22} />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
