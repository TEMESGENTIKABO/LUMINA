import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HeaderNavItem } from "@/config/headerNav";
import { ICONS } from "./variants";
import { hdLabels, navHref, subLabel } from "./utils";

export interface Card {
  slug: string;
  title_en: string;
  title_am: string | null;
  dek_en: string;
  dek_am: string | null;
  heroImageUrl: string | null;
  category: { name_en: string; name_am: string | null } | null;
}
export type CardState = Card[] | "loading" | undefined;

export function MegaPanel({
  id,
  item,
  title,
  locale,
  cards,
}: {
  id: string;
  item: HeaderNavItem;
  title: string;
  locale: string;
  cards: CardState;
}) {
  const L = hdLabels(locale);
  const am = locale === "am";
  const subs = item.subs ?? [];
  const cardTitle = (a: Card) => (am && a.title_am ? a.title_am : a.title_en);
  const cardDek = (a: Card) => (am && a.dek_am ? a.dek_am : a.dek_en);
  const cardTag = (a: Card) =>
    am && a.category?.name_am
      ? a.category.name_am
      : (a.category?.name_en ?? "News");

  const loading = cards === undefined || cards === "loading";

  return (
    <div className="hd-panel" id={id} role="region" aria-label={title}>
      <div
        className={`hd-w hd-pgrid ${item.preview ? "" : "hd-pgrid--lite"} ${
          subs.length > 6 ? "hd-pgrid--wide" : ""
        }`}
      >
        <div className="hd-pintro">
          <div className="hd-lab">{L.explore}</div>
          <Link
            href={navHref(locale, item.path)}
            className="hd-ptitle hd-serif"
          >
            {title}
          </Link>
          <Link href={navHref(locale, item.path)} className="hd-va">
            {L.viewAll} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <ul className={`hd-list ${subs.length > 6 ? "hd-list--2" : ""}`}>
          {subs.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.path + s.label}>
                <Link href={navHref(locale, s.path)}>
                  <span className="hd-ico">
                    <Icon size={16} />
                  </span>
                  {subLabel(s, locale)}
                </Link>
              </li>
            );
          })}
        </ul>

        {item.preview && (
          <div className="hd-feed">
            <div className="hd-lab">{L.latestIn(title)}</div>
            <div className="hd-cards">
              {loading ? (
                <>
                  <div className="hd-sk hd-sk--lead" />
                  <div className="hd-sk hd-sk--row" />
                  <div className="hd-sk hd-sk--row" />
                </>
              ) : cards.length === 0 ? (
                <p className="hd-empty">{L.noStories}</p>
              ) : (
                cards.map((a, n) => (
                  <Link
                    key={a.slug}
                    href={`/${locale}/article/${a.slug}`}
                    className={`hd-card ${n === 0 ? "hd-card--lead" : ""}`}
                  >
                    <div className="hd-im">
                      {a.heroImageUrl && (
                        <Image
                          src={a.heroImageUrl}
                          alt=""
                          fill
                          sizes={n === 0 ? "380px" : "120px"}
                        />
                      )}
                    </div>
                    <span className="hd-chipx">{cardTag(a)}</span>
                    <h4>{cardTitle(a)}</h4>
                    {n === 0 && <p>{cardDek(a)}</p>}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="hd-pfoot">
        <div className="hd-w hd-pfoot-in">
          <p>
            <b>{L.newsletterCta}</b>
            <span>{L.newsletterSub}</span>
          </p>
          <Link
            href={navHref(locale, "newsletters")}
            className="hd-btn hd-btn--ghost"
          >
            {L.newsletters} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
