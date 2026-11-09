"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, Zap } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { stripLinks } from "@/config/headerNav";
import type { StripKind, Variant } from "./variants";
import { hdLabels, subLabel } from "./utils";
import { Utilities } from "./Utilities";

export interface BreakingItem {
  title: string;
  href: string;
}

// Social links come from env so you can switch them on without touching code,
// e.g. NEXT_PUBLIC_SOCIAL_X=https://x.com/yourhandle. Unset ones are not drawn.
const SOCIAL = [
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    Icon: IconBrandFacebook,
  },
  { label: "X", href: process.env.NEXT_PUBLIC_SOCIAL_X, Icon: IconBrandX },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
    Icon: IconBrandYoutube,
  },
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    Icon: IconBrandInstagram,
  },
  {
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
    Icon: IconBrandLinkedin,
  },
].flatMap((s) => (s.href ? [{ ...s, href: s.href }] : []));

function Badge({ strip, locale }: { strip: StripKind; locale: string }) {
  const L = hdLabels(locale);
  switch (strip) {
    case "pill":
      return (
        <span className="hd-pill hd-pill--brand">
          <Zap size={13} aria-hidden="true" /> {L.breaking}
          {L.breakingTail && (
            <span className="hd-wide">&nbsp;{L.breakingTail}</span>
          )}
        </span>
      );
    case "text":
      return <span className="hd-brk-text">{L.breaking}</span>;
    case "live":
      return (
        <span className="hd-pill hd-pill--live">
          <span className="hd-livedot" aria-hidden="true" /> {L.live}
        </span>
      );
    case "latest":
      return (
        <span className="hd-pill hd-pill--latest">
          <Zap size={13} aria-hidden="true" /> {L.latest}
        </span>
      );
    default:
      return null;
  }
}

function Ticker({
  strip,
  items,
  locale,
}: {
  strip: StripKind;
  items: BreakingItem[];
  locale: string;
}) {
  const L = hdLabels(locale);
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false); // pointer / focus is inside
  const [halted, setHalted] = useState(false); // user pressed pause
  const count = items.length;

  useEffect(() => {
    if (count < 2 || hover || halted) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [count, hover, halted, i]);

  if (strip === "links" || strip === "black" || count === 0) {
    const black = strip === "black";
    const links = black ? stripLinks.about : stripLinks.news;
    return (
      <div className="hd-lead">
        <nav
          className={`hd-links ${black ? "hd-links--wide" : ""}`}
          aria-label={L.secondary}
        >
          {links.map((l, n) => (
            <Fragment key={l.path}>
              {n > 0 && !black && <i aria-hidden="true">/</i>}
              <Link href={`/${locale}/${l.path}`}>{subLabel(l, locale)}</Link>
            </Fragment>
          ))}
        </nav>
      </div>
    );
  }

  const idx = i % count;
  const cur = items[idx];

  return (
    <div
      className="hd-lead"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Badge strip={strip} locale={locale} />
      <div className={strip === "pill" ? "hd-headpill" : "hd-headrow"}>
        {/* key replays the entrance animation; aria-live is off on purpose so
            a rotating headline never interrupts a screen reader */}
        <Link key={idx} href={cur.href} className="hd-hl" aria-live="off">
          {cur.title}
        </Link>
        {count > 1 && (
          <div className="hd-ctl">
            <button
              type="button"
              className="hd-prev"
              aria-label={L.prevHeadline}
              onClick={() => setI((idx - 1 + count) % count)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label={halted ? L.playHeadlines : L.pauseHeadlines}
              onClick={() => setHalted((v) => !v)}
            >
              {halted ? <Play size={13} /> : <Pause size={13} />}
            </button>
            <button
              type="button"
              aria-label={L.nextHeadline}
              onClick={() => setI((idx + 1) % count)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function TopStrip({
  variant,
  items,
  locale,
  dateLabel,
  ethLabel,
  weather,
}: {
  variant: Variant;
  items: BreakingItem[];
  locale: string;
  dateLabel: string;
  ethLabel: string;
  weather: React.ReactNode;
}) {
  const L = hdLabels(locale);
  if (variant.strip === "none") return null;
  const bare = variant.strip === "links" || variant.strip === "black";

  return (
    <div className={`hd-strip ${bare ? "hd-nostrip" : ""}`}>
      <div className="hd-w hd-strip-in">
        <Ticker strip={variant.strip} items={items} locale={locale} />
        <div className="hd-tools">
          {!variant.center && (
            <span className="hd-sdate">
              <b>{dateLabel}</b>
              <i aria-hidden="true">·</i>
              {ethLabel} {L.ec}
            </span>
          )}
          <Utilities locale={locale} />
          {SOCIAL.length > 0 && (
            <div className="hd-soc">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={15} stroke={1.8} />
                </a>
              ))}
            </div>
          )}
          {!variant.weatherInBar && weather}
        </div>
      </div>
    </div>
  );
}
