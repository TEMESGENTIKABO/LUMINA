"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  Crown,
  LogOut,
  Mail,
  Search,
  User,
  X,
} from "lucide-react";
import { headerNav, stripLinks } from "@/config/headerNav";
import type { Variant } from "./variants";
import { Logo } from "./Logo";
import { Utilities } from "./Utilities";
import {
  hdLabels,
  initialsOf,
  isNavActive,
  navHref,
  navLabel,
  subLabel,
} from "./utils";

function DrawerAccount({
  locale,
  onNavigate,
}: {
  locale: string;
  onNavigate: () => void;
}) {
  const { data: session, status } = useSession();
  const L = hdLabels(locale);

  if (status === "loading")
    return (
      <div
        className="hd-acct hd-sk"
        aria-hidden="true"
        style={{ height: 76 }}
      />
    );

  if (!session)
    return (
      <div className="hd-acct">
        <span className="hd-av hd-av--lg hd-av--ghost">
          <User size={20} />
        </span>
        <div className="hd-acct-t">
          <b>{L.guest}</b>
          <small>{L.guestSub}</small>
        </div>
        <Link
          href={`/${locale}/sign-in`}
          className="hd-btn"
          onClick={onNavigate}
        >
          {L.signIn}
        </Link>
      </div>
    );

  const name = session.user?.name ?? session.user?.email ?? "";
  return (
    <div className="hd-acct">
      <span className="hd-av hd-av--lg">
        {initialsOf(session.user?.name, session.user?.email)}
      </span>
      <div className="hd-acct-t">
        <b>{name}</b>
        <Link href={`/${locale}/account`} onClick={onNavigate}>
          {L.account}
        </Link>
      </div>
      <button
        type="button"
        className="hd-ib"
        aria-label={L.signOut}
        onClick={() => signOut({ callbackUrl: `/${locale}` })}
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}

export function MobileDrawer({
  open,
  onClose,
  onSearch,
  openerRef,
  locale,
  siteName,
  variantId,
  variant,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  openerRef: React.RefObject<HTMLElement | null>;
  locale: string;
  siteName: string;
  variantId: number;
  variant: Variant;
  pathname: string;
}) {
  const L = hdLabels(locale);
  const [expanded, setExpanded] = useState<string | null>(null);
  const asideRef = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  // Style 3 keeps its burger (and so its drawer) on the right.
  const fromRight = variantId === 3;

  // Focus the close button, trap Tab, Escape closes, focus goes back.
  useEffect(() => {
    if (!open) return;
    const aside = asideRef.current;
    const opener = openerRef.current;
    const raf = requestAnimationFrame(() =>
      aside?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !aside) return;
      const f = Array.from(
        aside.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"),
      ).filter((el) => !el.closest("[inert]"));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, onClose, openerRef]);

  // Swipe the panel towards the edge it came from to close it.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = Math.abs(t.clientY - s.y);
    if (dy < 50 && Math.abs(dx) > 70 && (fromRight ? dx > 0 : dx < 0))
      onClose();
  };

  const SubIcon = variant.subIcon === "crown" ? Crown : Mail;

  return (
    <div className={`hd-drawer ${open ? "open" : ""}`} inert={!open}>
      <div className="hd-scrim" onClick={onClose} />
      <aside
        ref={asideRef}
        className="hd-aside"
        role="dialog"
        aria-modal="true"
        aria-label={L.menu}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="hd-dh">
          <Logo
            siteName={siteName}
            locale={locale}
            emblem={variant.emblem}
            tagline={variant.tagline}
            onClick={onClose}
          />
          <button
            type="button"
            className="hd-ib"
            data-autofocus
            aria-label={L.closeMenu}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <div className="hd-db">
          <button
            type="button"
            className="hd-dsearch"
            onClick={() => {
              onClose();
              onSearch();
            }}
          >
            <Search size={18} />
            <span>{L.searchPh}</span>
          </button>

          <nav aria-label={L.menu}>
            {headerNav.map((item, n) => {
              const isOpen = expanded === item.key;
              const active = isNavActive(item, pathname, locale);
              const label = navLabel(item, locale, variantId === 1);
              return (
                <div
                  key={item.key}
                  className="hd-drow"
                  style={{ "--i": n } as React.CSSProperties}
                >
                  <div className="hd-drow-h">
                    <Link
                      href={navHref(locale, item.path)}
                      onClick={onClose}
                      className={`hd-serif ${active ? "on" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {label}
                    </Link>
                    {item.subs && (
                      <button
                        type="button"
                        className="hd-ib"
                        aria-label={`${isOpen ? L.collapse : L.expand} ${label}`}
                        aria-expanded={isOpen}
                        aria-controls={`hd-sub-${item.key}`}
                        onClick={() => setExpanded(isOpen ? null : item.key)}
                      >
                        <ChevronDown
                          size={20}
                          className={`hd-chev ${isOpen ? "up" : ""}`}
                        />
                      </button>
                    )}
                  </div>
                  {item.subs && (
                    <div
                      id={`hd-sub-${item.key}`}
                      className={`hd-acc ${isOpen ? "open" : ""}`}
                      inert={!isOpen}
                    >
                      <div>
                        <div className="hd-dsubs">
                          {item.subs.map((s) => (
                            <Link
                              key={s.path + s.label}
                              href={navHref(locale, s.path)}
                              onClick={onClose}
                            >
                              {subLabel(s, locale)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hd-dquick">
            {stripLinks.news.map((l) => (
              <Link
                key={l.path}
                href={navHref(locale, l.path)}
                onClick={onClose}
              >
                {subLabel(l, locale)}
              </Link>
            ))}
            <Link href={navHref(locale, "newsletters")} onClick={onClose}>
              {L.newsletters}
            </Link>
          </div>

          <DrawerAccount locale={locale} onNavigate={onClose} />
        </div>

        <div className="hd-df">
          <Link
            href={navHref(locale, "membership")}
            className="hd-dsub"
            onClick={onClose}
          >
            <SubIcon size={16} aria-hidden="true" />
            {L.subscribe}
          </Link>
          <div className="hd-dtools">
            <Utilities locale={locale} />
          </div>
        </div>
      </aside>
    </div>
  );
}
