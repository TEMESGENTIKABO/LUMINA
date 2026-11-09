"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Bookmark,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  UserCheck,
} from "lucide-react";
import { hdLabels, initialsOf } from "./header/utils";

const subscribe = () => () => {};

export function AccountMenu({ locale }: { locale: string }) {
  const { data: session, status } = useSession();
  const L = hdLabels(locale);
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Reserve the exact space so the bar never jumps while the session loads.
  if (!mounted || status === "loading") {
    return <span className="hd-ib hd-sk hd-round" aria-hidden="true" />;
  }

  if (!session) {
    return (
      <Link
        href={`/${locale}/sign-in`}
        className="hd-signin"
        aria-label={L.signIn}
      >
        <User size={18} />
        <span className="hd-signtxt">{L.signIn}</span>
      </Link>
    );
  }

  const name = session.user?.name ?? session.user?.email ?? "";
  const email = session.user?.email ?? "";
  const initials = initialsOf(session.user?.name, session.user?.email);
  const isStaff = ["ADMIN", "EDITOR", "AUTHOR"].includes(
    (session.user as { role?: string } | undefined)?.role ?? "",
  );

  return (
    <div ref={rootRef} className="hd-am">
      <button
        ref={btnRef}
        type="button"
        className="hd-amb"
        aria-label={L.account}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="hd-av">{initials}</span>
        <ChevronDown size={14} className="hd-amc" />
      </button>

      <div
        id={menuId}
        className={`hd-menu ${open ? "open" : ""}`}
        inert={!open}
      >
        <div className="hd-menu-head">
          <span className="hd-av hd-av--lg">{initials}</span>
          <div>
            <b>{name}</b>
            {email && email !== name && <small>{email}</small>}
          </div>
        </div>
        <nav aria-label={L.account} className="hd-menu-list">
          <Link href={`/${locale}/account`} onClick={() => close()}>
            <User size={16} /> {L.account}
          </Link>
          <Link href={`/${locale}/account/saved`} onClick={() => close()}>
            <Bookmark size={16} /> {L.saved}
          </Link>
          <Link href={`/${locale}/account/following`} onClick={() => close()}>
            <UserCheck size={16} /> {L.following}
          </Link>
          {isStaff && (
            <Link href="/admin" onClick={() => close()}>
              <LayoutDashboard size={16} /> {L.admin}
            </Link>
          )}
        </nav>
        <button
          type="button"
          className="hd-menu-out"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          <LogOut size={16} /> {L.signOut}
        </button>
      </div>
    </div>
  );
}
