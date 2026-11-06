"use client";

import "./header.css";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Cpu,
  Crown,
  Globe,
  Landmark,
  LineChart,
  Mail,
  Menu,
  MessageSquareQuote,
  Music,
  Newspaper,
  PlayCircle,
  Rocket,
  Search,
  Sparkles,
  Star,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { AccountMenu } from "../AccountMenu";
import { DarkModeToggle } from "../DarkModeToggle";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { Emblem } from "./Emblem";
import {
  headerNav,
  stripLinks,
  type HeaderNavItem,
  type IconKey,
} from "@/config/headerNav";
import { THEMES as THEME_LIST, THEME_COUNT } from "@/config/themes";

interface BreakingItem {
  title: string;
  href: string;
}
interface Card {
  slug: string;
  title_en: string;
  title_am: string | null;
  dek_en: string;
  dek_am: string | null;
  heroImageUrl: string | null;
  category: { name_en: string; name_am: string | null } | null;
}

type StripKind =
  "pill" | "text" | "live" | "latest" | "links" | "black" | "none";
interface Theme {
  strip: StripKind;
  emblem: boolean;
  tagline: boolean;
  bell: boolean;
  subscribe: boolean;
  subIcon: "mail" | "crown" | null;
  burgerRight: boolean;
  themeToggle: boolean;
  center: boolean;
  weatherInBar: boolean;
  userIcon: boolean;
}
const base: Theme = {
  strip: "none",
  emblem: false,
  tagline: false,
  bell: false,
  subscribe: false,
  subIcon: null,
  burgerRight: false,
  themeToggle: false,
  center: false,
  weatherInBar: false,
  userIcon: false,
};
const THEMES: Record<number, Theme> = {
  1: {
    ...base,
    strip: "pill",
    emblem: true,
    tagline: true,
    bell: true,
    subscribe: true,
    subIcon: "mail",
  },
  2: { ...base, strip: "text", emblem: true, subscribe: true, subIcon: "mail" },
  3: { ...base, strip: "live", emblem: true, burgerRight: true },
  4: { ...base, strip: "links", themeToggle: true },
  5: {
    ...base,
    strip: "latest",
    emblem: true,
    bell: true,
    subscribe: true,
    subIcon: "mail",
  },
  6: { ...base, strip: "black", emblem: true, tagline: true, subscribe: true },
  7: {
    ...base,
    strip: "none",
    emblem: true,
    tagline: true,
    bell: true,
    subscribe: true,
    subIcon: "crown",
    weatherInBar: true,
    userIcon: true,
  },
  8: { ...base, strip: "links", emblem: true, center: true, subscribe: true },
  9: { ...base, strip: "pill", emblem: true, subscribe: true, subIcon: "mail" },
  10: {
    ...base,
    strip: "text",
    emblem: true,
    subscribe: true,
    subIcon: "mail",
  },
};

const ICONS: Record<IconKey, React.ComponentType<{ size?: number }>> = {
  star: Star,
  politics: Landmark,
  business: BarChart3,
  tech: Cpu,
  globe: Globe,
  analysis: LineChart,
  film: Clapperboard,
  music: Music,
  style: Sparkles,
  heritage: Landmark,
  startup: Rocket,
  work: Briefcase,
  book: BookOpen,
  opinion: MessageSquareQuote,
  video: PlayCircle,
  paper: Newspaper,
  mail: Mail,
  search: Search,
};

// TODO: replace "#" with your real social profile URLs.
const SOCIAL = [
  { label: "Facebook", href: "#", Icon: IconBrandFacebook },
  { label: "X", href: "#", Icon: IconBrandX },
  { label: "YouTube", href: "#", Icon: IconBrandYoutube },
  { label: "Instagram", href: "#", Icon: IconBrandInstagram },
  { label: "LinkedIn", href: "#", Icon: IconBrandLinkedin },
];

function LangSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();
  const other = locale === "am" ? "en" : "am";
  const href =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${other}`) ||
    `/${other}`;
  return (
    <Link
      href={href}
      hrefLang={other}
      className="hd-lang"
      aria-label={other === "am" ? "አማርኛ" : "English"}
    >
      {other === "am" ? "አማ" : "EN"}
    </Link>
  );
}

function AccountIcon({ locale }: { locale: string }) {
  const { data: session } = useSession();
  return (
    <Link
      href={session ? `/${locale}/account` : `/${locale}/sign-in`}
      className="hd-ib hd-user"
      aria-label={session ? "Account" : "Sign in"}
    >
      <User size={19} />
    </Link>
  );
}

function Lead({
  theme,
  items,
  locale,
}: {
  theme: Theme;
  items: BreakingItem[];
  locale: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length, i]);

  const useLinks =
    theme.strip === "links" || theme.strip === "black" || items.length === 0;
  if (useLinks) {
    const black = theme.strip === "black";
    const links = black ? stripLinks.about : stripLinks.news;
    return (
      <div className="hd-lead">
        <nav
          className="hd-links"
          aria-label="Secondary"
          style={black ? { gap: 22 } : undefined}
        >
          {links.map((l, n) => (
            <Fragment key={l.path}>
              {n > 0 && !black && <i>/</i>}
              <Link href={`/${locale}/${l.path}`}>{l.label}</Link>
            </Fragment>
          ))}
        </nav>
      </div>
    );
  }

  const cur = items[i % items.length];
  const headline = (
    <Link key={i} href={cur.href} className="hd-hl">
      {cur.title}
    </Link>
  );
  const next =
    items.length > 1 ? (
      <button
        className="hd-next"
        aria-label="Next headline"
        onClick={() => setI((i + 1) % items.length)}
        style={theme.strip === "pill" ? { color: "var(--hd-act)" } : undefined}
      >
        {theme.strip === "pill" || theme.strip === "text" ? (
          <ChevronRight size={16} />
        ) : (
          <ArrowRight size={15} />
        )}
      </button>
    ) : null;

  return (
    <div className="hd-lead">
      {theme.strip === "pill" && (
        <>
          <span className="hd-pill hd-pillv">
            <Zap size={13} /> Breaking News
          </span>
          <div className="hd-headpill">
            {headline}
            {next}
          </div>
        </>
      )}
      {theme.strip === "text" && (
        <>
          <span className="hd-brk-text">BREAKING</span>
          {headline}
          {next}
        </>
      )}
      {theme.strip === "live" && (
        <>
          <span
            className="hd-pill"
            style={{ background: "#e11d2e", color: "#fff" }}
          >
            <span className="hd-livedot" /> LIVE
          </span>
          {headline}
          {next}
        </>
      )}
      {theme.strip === "latest" && (
        <>
          <span
            className="hd-pill"
            style={{ background: "#d62a84", color: "#fff" }}
          >
            <Zap size={13} /> Latest
          </span>
          {headline}
          {next}
        </>
      )}
    </div>
  );
}

export function HeaderRoot({
  locale,
  items,
  defaultVariant,
  weather,
  dateLabel,
  ethLabel,
}: {
  locale: string;
  items: BreakingItem[];
  defaultVariant: number;
  weather: React.ReactNode;
  dateLabel: string;
  ethLabel: string;
}) {
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [variant, setVariant] = useState(
    THEMES[defaultVariant] ? defaultVariant : 1,
  );
  const [picker, setPicker] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cards, setCards] = useState<Record<string, Card[] | "loading">>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const topRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[variant];

  // THIS is what makes the homepage, footer and admin follow the theme.
  useEffect(() => {
    document.documentElement.dataset.aksumTheme = String(variant);
  }, [variant]);

  // Preview a style with ?header=1…10 (remembered for this browser tab only).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("header");
    let n = Number(q);
    let stored = 0;
    try {
      stored = Number(sessionStorage.getItem("aksum-header"));
    } catch {}
    if (!n) n = stored;
    const frame = window.requestAnimationFrame(() => {
      if (n >= 1 && n <= THEME_COUNT) setVariant(n);
      if (q || stored) setPicker(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(n: number) {
    setVariant(n);
    try {
      sessionStorage.setItem("aksum-header", String(n));
    } catch {}
    const u = new URL(window.location.href);
    u.searchParams.set("header", String(n));
    window.history.replaceState(null, "", u);
  }

  useEffect(() => {
    const onScroll = () =>
      setPinned(
        window.scrollY > Math.max(topRef.current?.offsetHeight ?? 0, 40),
      );
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpenKey(null);
    setMenuOpen(false);
  }
  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const href = (path: string) => (path ? `/${locale}/${path}` : `/${locale}`);
  const rest = pathname.replace(new RegExp(`^/${locale}/?`), "");
  const isActive = (item: HeaderNavItem) =>
    item.key === "home"
      ? rest === ""
      : item.match.some((m) => rest === m || rest.startsWith(m + "/"));
  const labelOf = (item: HeaderNavItem) =>
    locale === "am"
      ? item.labelAm
      : variant === 1 && item.altLabel
        ? item.altLabel
        : item.label;

  const load = useCallback((item: HeaderNavItem) => {
    if (!item.preview) return;
    setCards((c) => {
      if (c[item.key] !== undefined) return c;
      fetch(`/api/nav-preview?category=${encodeURIComponent(item.preview!)}`)
        .then((r) => r.json())
        .then((d) => setCards((x) => ({ ...x, [item.key]: d.articles ?? [] })))
        .catch(() => setCards((x) => ({ ...x, [item.key]: [] })));
      return { ...c, [item.key]: "loading" };
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

  const subLabel = locale === "am" ? "ይመዝገቡ" : "Subscribe";
  const cardTitle = (a: Card) =>
    locale === "am" && a.title_am ? a.title_am : a.title_en;
  const cardDek = (a: Card) =>
    locale === "am" && a.dek_am ? a.dek_am : a.dek_en;
  const cardTag = (a: Card) =>
    locale === "am" && a.category?.name_am
      ? a.category.name_am
      : (a.category?.name_en ?? "News");

  const logo = (
    <Link href={`/${locale}`} className="hd-logo" aria-label="Aksum home">
      {theme.emblem && <Emblem className="hd-emb" />}
      <span>
        <span className="hd-name hd-serif">AKSUM</span>
        {theme.tagline && (
          <small className="hd-tag">TRUTH · INSIGHT · IMPACT</small>
        )}
      </span>
    </Link>
  );

  const subIcon =
    theme.subIcon === "crown" ? (
      <Crown size={16} />
    ) : theme.subIcon === "mail" ? (
      <Mail size={16} />
    ) : null;

  const drawer = (
    <div className={`hd hd-v${variant}`}>
      <div className={`hd-drawer ${menuOpen ? "open" : ""}`} inert={!menuOpen}>
        <div className="hd-scrim" onClick={() => setMenuOpen(false)} />
        <aside
          className="hd-aside"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="hd-dh">
            {logo}
            <button
              className="hd-ib"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
          <div className="hd-db">
            {headerNav.map((item) => (
              <div key={item.key} className="hd-drow">
                <div>
                  <Link
                    href={href(item.path)}
                    onClick={() => setMenuOpen(false)}
                    className="hd-serif"
                  >
                    {labelOf(item)}
                  </Link>
                  {item.subs && (
                    <button
                      className="hd-ib"
                      aria-label={`Expand ${item.label}`}
                      aria-expanded={expanded === item.key}
                      onClick={() =>
                        setExpanded(expanded === item.key ? null : item.key)
                      }
                    >
                      <ChevronDown
                        size={20}
                        style={{
                          transform:
                            expanded === item.key
                              ? "rotate(180deg)"
                              : undefined,
                          transition: "transform .2s",
                        }}
                      />
                    </button>
                  )}
                </div>
                {item.subs && expanded === item.key && (
                  <div className="hd-dsubs">
                    {item.subs.map((s) => (
                      <Link
                        key={s.path + s.label}
                        href={href(s.path)}
                        onClick={() => setMenuOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hd-df">
            <Link
              href={`/${locale}/membership`}
              className="hd-dsub"
              onClick={() => setMenuOpen(false)}
            >
              {subLabel}
            </Link>
            <div className="hd-dtools">
              <LangSwitch locale={locale} />
              <span className="hd-dtheme">
                <DarkModeToggle />
              </span>
              <Link
                href={`/${locale}/account`}
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  return (
    <>
      <div className={`hd hd-v${variant}`}>
        <div ref={topRef}>
          {theme.strip !== "none" && (
            <div
              className={`hd-strip ${theme.strip === "links" || theme.strip === "black" ? "hd-nostrip" : ""}`}
            >
              <div className="hd-w hd-strip-in">
                <Lead theme={theme} items={items} locale={locale} />
                <div className="hd-tools">
                  <LangSwitch locale={locale} />
                  <div className="hd-soc">
                    {SOCIAL.map(({ label, href: url, Icon }) => (
                      <a
                        key={label}
                        href={url}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon size={15} stroke={1.8} />
                      </a>
                    ))}
                  </div>
                  {!theme.weatherInBar && weather}
                  <AccountMenu locale={locale} />
                </div>
              </div>
            </div>
          )}

          {theme.center && (
            <div className="hd-mast">
              <div className="hd-w hd-mast-in">
                <div className="hd-date">
                  <b>{dateLabel}</b>
                  {ethLabel} EC
                </div>
                <Link
                  href={`/${locale}`}
                  className="hd-logo-c"
                  aria-label="Aksum home"
                >
                  <Emblem className="hd-emb" />
                  <span className="hd-name hd-serif">AKSUM</span>
                  <span className="hd-tag2">TRUTH · INSIGHT · IMPACT</span>
                </Link>
                <div className="hd-mast-r">
                  <Link href={`/${locale}/membership`} className="hd-sub">
                    {subLabel}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <header className={`hd-sticky ${pinned ? "hd-pinned" : ""}`}>
          <div className="hd-bar">
            <div className="hd-w hd-bar-in">
              <button
                className="hd-burger hd-burger-l"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
              {logo}

              <nav className="hd-nav" aria-label="Primary" onMouseLeave={hide}>
                {headerNav.map((item) => {
                  const hasPanel = !!item.subs;
                  const open = openKey === item.key;
                  const list = cards[item.key];
                  return (
                    <div
                      key={item.key}
                      className="hd-item"
                      onMouseEnter={() =>
                        hasPanel ? show(item, openKey ? 0 : 90) : hide()
                      }
                      onFocus={() => hasPanel && show(item, 0)}
                      onBlur={(e) => {
                        if (
                          !e.currentTarget.contains(
                            e.relatedTarget as Node | null,
                          )
                        )
                          hide();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          clearTimeout(timer.current);
                          setOpenKey(null);
                        }
                      }}
                    >
                      <Link
                        href={href(item.path)}
                        className={`hd-link ${isActive(item) ? "on" : ""} ${open ? "open" : ""}`}
                        aria-haspopup={hasPanel || undefined}
                        aria-expanded={hasPanel ? open : undefined}
                      >
                        {labelOf(item)}
                        {hasPanel && <ChevronDown size={13} />}
                      </Link>

                      {hasPanel && open && (
                        <div className="hd-panel">
                          <div className="hd-w hd-pgrid">
                            <div>
                              <div className="hd-lab">LATEST</div>
                              <Link
                                href={href(item.path)}
                                className="hd-ptitle hd-serif"
                              >
                                {labelOf(item)}
                              </Link>
                              <Link href={href(item.path)} className="hd-va">
                                View All {labelOf(item)}{" "}
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                            <ul className="hd-list">
                              {item.subs!.map((s) => {
                                const Icon = ICONS[s.icon];
                                return (
                                  <li key={s.path + s.label}>
                                    <Link href={href(s.path)}>
                                      <span className="hd-ico">
                                        <Icon size={16} />
                                      </span>
                                      {s.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                            <div className="hd-cards">
                              {list === undefined || list === "loading" ? (
                                [0, 1, 2].map((n) => (
                                  <div
                                    key={n}
                                    className="hd-im"
                                    style={{ opacity: 0.6 }}
                                  />
                                ))
                              ) : list.length === 0 ? (
                                <p className="hd-empty">
                                  No stories yet in this section.
                                </p>
                              ) : (
                                list.map((a) => (
                                  <Link
                                    key={a.slug}
                                    href={`/${locale}/article/${a.slug}`}
                                    className="hd-card"
                                  >
                                    <div className="hd-im">
                                      {a.heroImageUrl && (
                                        <Image
                                          src={a.heroImageUrl}
                                          alt={cardTitle(a)}
                                          fill
                                          sizes="260px"
                                        />
                                      )}
                                    </div>
                                    <span className="hd-chipx">
                                      {cardTag(a)}
                                    </span>
                                    <h4>{cardTitle(a)}</h4>
                                    <p>{cardDek(a)}</p>
                                  </Link>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="hd-icons">
                {theme.weatherInBar && weather}
                <button
                  className="hd-ib"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search size={19} />
                </button>
                {theme.bell && (
                  <Link
                    href={`/${locale}/newsletters`}
                    className="hd-ib hd-bell"
                    aria-label="Alerts and newsletters"
                  >
                    <Bell size={19} />
                    {(variant === 1 || variant === 7) && (
                      <i className="hd-dot" />
                    )}
                  </Link>
                )}
                {theme.userIcon && <AccountIcon locale={locale} />}
                {theme.themeToggle && (
                  <span className="hd-ib hd-theme">
                    <DarkModeToggle />
                  </span>
                )}
                {theme.subscribe && (
                  <Link href={`/${locale}/membership`} className="hd-sub">
                    {subIcon}
                    {subLabel}
                  </Link>
                )}
                {theme.burgerRight && (
                  <button
                    className="hd-burger hd-burger-r"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen(true)}
                  >
                    <Menu size={22} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {picker && (
          <div className="hd-picker" role="group" aria-label="Header style">
            <span>Header style</span>
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                className={t.id === variant ? "on" : ""}
                title={t.name}
                onClick={() => choose(t.id)}
              >
                {t.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted && createPortal(drawer, document.body)}
      {mounted &&
        searchOpen &&
        createPortal(
          <SearchOverlay
            locale={locale}
            onClose={() => setSearchOpen(false)}
          />,
          document.body,
        )}
    </>
  );
}
