"use client";

import "./header.css";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Crown, Mail, Menu, Search } from "lucide-react";
import { AccountMenu } from "../AccountMenu";
import { Emblem } from "./Emblem";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";
import { MegaPanel, type CardState } from "./MegaPanel";
import { MobileDrawer } from "./MobileDrawer";
import { TopStrip, type BreakingItem } from "./TopStrip";
import { Utilities } from "./Utilities";
import { VARIANTS } from "./variants";
import { hdClass, hdLabels, isNavActive, navHref, navLabel } from "./utils";
import { headerNav, type HeaderNavItem } from "@/config/headerNav";
import { THEMES as THEME_LIST, THEME_COUNT } from "@/config/themes";

// The ?header=1…10 style picker is a design-review tool. It is off in
// production unless you opt in with NEXT_PUBLIC_HEADER_PICKER=1, so visitors
// cannot change your header by editing the URL.
const PICKER_ENABLED =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_HEADER_PICKER === "1";

const subscribeNoop = () => () => {};

export function HeaderRoot({
  siteName,
  locale,
  items,
  defaultVariant,
  weather,
  dateLabel,
  ethLabel,
}: {
  siteName: string;
  locale: string;
  items: BreakingItem[];
  defaultVariant: number;
  weather: React.ReactNode;
  dateLabel: string;
  ethLabel: string;
}) {
  const pathname = usePathname();
  const L = hdLabels(locale);
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [variantId, setVariantId] = useState(
    VARIANTS[defaultVariant] ? defaultVariant : 1,
  );
  const [picker, setPicker] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [cards, setCards] = useState<Record<string, CardState>>({});

  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requested = useRef(new Set<string>());
  const topRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const variant = VARIANTS[variantId];

  // Other CSS (pages, footer) can key off this, so it stays.
  useEffect(() => {
    document.documentElement.dataset.aksumTheme = String(variantId);
  }, [variantId]);

  // Preview a style with ?header=1…10 (remembered for this tab only).
  useEffect(() => {
    if (!PICKER_ENABLED) return;
    const q = new URLSearchParams(window.location.search).get("header");
    let n = Number(q);
    let stored = 0;
    try {
      stored = Number(sessionStorage.getItem("aksum-header"));
    } catch {}
    if (!n) n = stored;
    const frame = window.requestAnimationFrame(() => {
      // VARIANTS[n] also rejects things like ?header=1.5 that used to crash.
      if (VARIANTS[n] && n <= THEME_COUNT) setVariantId(n);
      if (q || stored) setPicker(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(n: number) {
    setVariantId(n);
    try {
      sessionStorage.setItem("aksum-header", String(n));
    } catch {}
    const u = new URL(window.location.href);
    u.searchParams.set("header", String(n));
    window.history.replaceState(null, "", u);
  }

  // One rAF-throttled scroll handler: condensed bar + reading progress.
  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      const y = Math.max(window.scrollY, 0);
      setPinned(y > Math.max(topRef.current?.offsetHeight ?? 0, 40));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      stickyRef.current?.style.setProperty(
        "--p",
        String(max > 0 ? Math.min(y / max, 1) : 0),
      );
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    run();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Close everything when the route changes.
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpenKey(null);
    setMenuOpen(false);
    setSearchOpen(false);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  // Scroll lock (with scrollbar compensation so desktop doesn't jump).
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const b = document.body;
    const prev = { o: b.style.overflow, p: b.style.paddingRight };
    const gap = window.innerWidth - document.documentElement.clientWidth;
    b.style.overflow = "hidden";
    if (gap > 0) b.style.paddingRight = `${gap}px`;
    return () => {
      b.style.overflow = prev.o;
      b.style.paddingRight = prev.p;
    };
  }, [menuOpen, searchOpen]);

  // "/" or Ctrl/⌘+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        !!el &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) ||
          el.isContentEditable);
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (cmdK || (!typing && e.key === "/")) {
        e.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Tap/click outside the mega menu closes it (touch laptops, iPads).
  useEffect(() => {
    if (!openKey) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openKey]);

  // Stories for a mega-menu section are fetched once, on first open.
  const load = useCallback((item: HeaderNavItem) => {
    if (!item.preview || requested.current.has(item.key)) return;
    requested.current.add(item.key);
    setCards((c) => ({ ...c, [item.key]: "loading" }));
    fetch(`/api/nav-preview?category=${encodeURIComponent(item.preview)}`)
      .then((r) => r.json())
      .then((d) => setCards((x) => ({ ...x, [item.key]: d.articles ?? [] })))
      .catch(() => {
        requested.current.delete(item.key);
        setCards((x) => ({ ...x, [item.key]: [] }));
      });
  }, []);

  function show(item: HeaderNavItem, delay: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpenKey(item.key);
      load(item);
    }, delay);
  }
  function hide() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenKey(null), 140);
  }
  function toggle(item: HeaderNavItem) {
    clearTimeout(timer.current);
    if (openKey === item.key) {
      setOpenKey(null);
    } else {
      setOpenKey(item.key);
      load(item);
    }
  }

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    openerRef.current = e.currentTarget;
    setMenuOpen(true);
  };
  // Stable identities: the drawer's focus effect depends on closeMenu.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const subIcon =
    variant.subIcon === "crown" ? (
      <Crown size={16} aria-hidden="true" />
    ) : variant.subIcon === "mail" ? (
      <Mail size={16} aria-hidden="true" />
    ) : null;

  const topics = headerNav
    .filter((i) => i.key !== "home")
    .map((i) => ({
      label: navLabel(i, locale, variantId === 1),
      href: navHref(locale, i.path),
    }));

  const cls = hdClass(variantId, locale);

  return (
    <>
      <div className={cls}>
        <div ref={topRef}>
          <TopStrip
            variant={variant}
            items={items}
            locale={locale}
            dateLabel={dateLabel}
            ethLabel={ethLabel}
            weather={weather}
          />

          {variant.center && (
            <div className="hd-mast">
              <div className="hd-w hd-mast-in">
                <div className="hd-date">
                  <b>{dateLabel}</b>
                  {ethLabel} {L.ec}
                </div>
                <Link
                  href={`/${locale}`}
                  className="hd-logo-c"
                  aria-label={`${siteName} — ${L.home}`}
                >
                  <Emblem className="hd-emb" />
                  <span className="hd-name hd-serif">{siteName}</span>
                  <span className="hd-tag2">TRUTH · INSIGHT · IMPACT</span>
                </Link>
                <div className="hd-mast-r">
                  <Link href={navHref(locale, "membership")} className="hd-sub">
                    {L.subscribe}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <header
          ref={stickyRef}
          className={`hd-sticky ${pinned ? "hd-pinned" : ""}`}
        >
          {/* dims the page behind an open mega menu; sits under the bar */}
          {openKey && <div className="hd-pscrim" aria-hidden="true" />}

          <div className="hd-bar">
            <div className="hd-w hd-bar-in">
              <button
                type="button"
                className="hd-burger hd-burger-l"
                aria-label={L.openMenu}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                onClick={openMenu}
              >
                <Menu size={22} />
              </button>

              <Logo
                siteName={siteName}
                locale={locale}
                emblem={variant.emblem}
                tagline={variant.tagline}
              />

              <nav
                ref={navRef}
                className="hd-nav"
                aria-label={L.primary}
                onMouseLeave={hide}
              >
                {headerNav.map((item) => {
                  const hasPanel = !!item.subs;
                  const open = openKey === item.key;
                  const active = isNavActive(item, pathname, locale);
                  const label = navLabel(item, locale, variantId === 1);
                  const panelId = `hd-panel-${item.key}`;
                  return (
                    <div
                      key={item.key}
                      className="hd-item"
                      onMouseEnter={() =>
                        hasPanel ? show(item, openKey ? 0 : 90) : hide()
                      }
                      onBlur={(e) => {
                        if (
                          !e.currentTarget.contains(
                            e.relatedTarget as Node | null,
                          )
                        )
                          hide();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape" && open) {
                          clearTimeout(timer.current);
                          setOpenKey(null);
                          e.currentTarget
                            .querySelector<HTMLElement>(".hd-tgl")
                            ?.focus();
                        }
                      }}
                    >
                      <div
                        className={`hd-lk ${active ? "on" : ""} ${open ? "open" : ""}`}
                      >
                        <Link
                          href={navHref(locale, item.path)}
                          className="hd-link"
                          aria-current={active ? "page" : undefined}
                        >
                          {label}
                        </Link>
                        {/* A real button for the menu, so keyboard and touch
                            users can open it without hover. */}
                        {hasPanel && (
                          <button
                            type="button"
                            className="hd-tgl"
                            aria-expanded={open}
                            aria-controls={panelId}
                            aria-label={`${label} — ${L.sectionMenu}`}
                            onClick={() => toggle(item)}
                          >
                            <ChevronDown size={14} aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      {hasPanel && open && (
                        <MegaPanel
                          id={panelId}
                          item={item}
                          title={label}
                          locale={locale}
                          cards={cards[item.key]}
                        />
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="hd-icons">
                {variant.weatherInBar && weather}
                {variant.strip === "none" && (
                  <div className="hd-util">
                    <Utilities locale={locale} />
                  </div>
                )}

                <button
                  type="button"
                  className="hd-spill"
                  onClick={openSearch}
                  aria-label={L.search}
                >
                  <Search size={16} />
                  <span>{L.search}</span>
                  <kbd>/</kbd>
                </button>
                <button
                  type="button"
                  className="hd-ib hd-sbtn"
                  onClick={openSearch}
                  aria-label={L.search}
                >
                  <Search size={20} />
                </button>

                {variant.bell && (
                  <Link
                    href={navHref(locale, "newsletters")}
                    className="hd-ib hd-bell"
                    aria-label={L.newsletters}
                    title={L.newsletters}
                  >
                    <Bell size={19} />
                  </Link>
                )}

                <AccountMenu locale={locale} />

                {variant.subscribe && (
                  <Link href={navHref(locale, "membership")} className="hd-sub">
                    {subIcon}
                    {L.subscribe}
                  </Link>
                )}
                {variant.burgerRight && (
                  <button
                    type="button"
                    className="hd-burger hd-burger-r"
                    aria-label={L.openMenu}
                    aria-haspopup="dialog"
                    aria-expanded={menuOpen}
                    onClick={openMenu}
                  >
                    <Menu size={22} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {PICKER_ENABLED && picker && (
          <div className="hd-picker" role="group" aria-label="Header style">
            <span>Header style</span>
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                type="button"
                className={t.id === variantId ? "on" : ""}
                title={t.name}
                onClick={() => choose(t.id)}
              >
                {t.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted &&
        createPortal(
          <div className={cls}>
            <MobileDrawer
              open={menuOpen}
              onClose={closeMenu}
              onSearch={openSearch}
              openerRef={openerRef}
              locale={locale}
              siteName={siteName}
              variantId={variantId}
              variant={variant}
              pathname={pathname}
            />
          </div>,
          document.body,
        )}
      {mounted &&
        searchOpen &&
        createPortal(
          <div className={cls}>
            <HeaderSearch
              locale={locale}
              topics={topics}
              onClose={closeSearch}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
