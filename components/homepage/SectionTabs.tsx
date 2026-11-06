"use client";

import "./home.css";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionHead } from "./SectionHead";
import type { Article } from "@/content/types/Article";

interface Section {
  id: string;
  label: string;
  href: string;
  articles: Article[];
}

export function SectionTabs({
  sections,
  locale,
}: {
  sections: Section[];
  locale: string;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (sections.length === 0) return null;

  const current = sections[Math.min(active, sections.length - 1)];
  const [lead, ...rest] = current.articles;
  const side = rest.slice(0, 4);

  function focusTab(i: number) {
    setActive(i);
    tabRefs.current[i]?.focus();
  }
  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const n = sections.length;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab((i + 1) % n);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab((i - 1 + n) % n);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(n - 1);
    }
  }

  const am = locale === "am";
  const t = (a: Article) => (am && a.title_am ? a.title_am : a.title_en);

  return (
    <section className="hp-sec" aria-label="Explore by section">
      <div className="hp-w">
        <SectionHead
          kicker="Explore"
          title="By Section"
          href={current.href}
          label={`View all ${current.label}`}
        />

        <div role="tablist" aria-label="Sections" className="hp-tabs">
          {sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`home-tab-${s.id}`}
              role="tab"
              aria-selected={i === active}
              aria-controls="home-tab-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="hp-tab"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div
          id="home-tab-panel"
          role="tabpanel"
          aria-labelledby={`home-tab-${current.id}`}
          key={current.id}
          className="hp-tabpanel"
        >
          {lead && (
            <Link
              href={`/${locale}/article/${lead.slug}`}
              className="hp-card hp-big"
            >
              <div
                className="hp-im"
                style={{ aspectRatio: "16 / 10", borderRadius: 16 }}
              >
                <Image
                  src={lead.heroImageUrl}
                  alt={t(lead)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <span className="hp-chip">
                {lead.subcategory ?? lead.category}
              </span>
              <h3 className="hp-serif">{t(lead)}</h3>
              <p className="hp-dek">
                {am && lead.dek_am ? lead.dek_am : lead.dek_en}
              </p>
            </Link>
          )}

          <div className="hp-side">
            {side.map((a) => (
              <Link
                key={a.slug}
                href={`/${locale}/article/${a.slug}`}
                className="hp-row"
              >
                <div className="hp-im">
                  <Image src={a.heroImageUrl} alt={t(a)} fill sizes="128px" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <span className="hp-lab">{a.subcategory ?? a.category}</span>
                  <h3 style={{ marginTop: 4 }}>{t(a)}</h3>
                  <div className="hp-meta">{a.readTimeMinutes} min read</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
