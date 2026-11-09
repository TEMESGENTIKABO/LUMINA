import Image from "next/image";
import { pickText, textLang } from "@/lib/homeLabels";

export interface SearchHit {
  slug: string;
  title_en: string;
  title_am?: string | null;
  heroImageUrl: string;
  category: string;
  subcategory?: string | null;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps matches of `query` in <mark>. split() with a capture group puts matches at odd indexes. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="hp-mark">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * One category of results inside the search listbox.
 * `offset` is the index of this group's first hit in the flat, keyboard-navigable list,
 * so ArrowUp/ArrowDown keep working across groups.
 */
export function SearchResultGroup({
  title,
  hits,
  locale,
  query,
  offset,
  activeIndex,
  idPrefix = "search-opt",
  onSelect,
  onHover,
}: {
  title: string;
  hits: SearchHit[];
  locale: string;
  query: string;
  offset: number;
  activeIndex: number;
  idPrefix?: string;
  onSelect: (slug: string) => void;
  onHover: (index: number) => void;
}) {
  if (hits.length === 0) return null;
  const headingId = `${idPrefix}-group-${offset}`;

  return (
    <li role="presentation" className="hp-sg">
      <p className="hp-sub" id={headingId}>
        {title}
      </p>
      <ul role="group" aria-labelledby={headingId}>
        {hits.map((hit, n) => {
          const index = offset + n;
          const active = index === activeIndex;
          const text = pickText(hit.title_en, hit.title_am, locale);
          return (
            <li
              key={hit.slug}
              role="option"
              id={`${idPrefix}-${index}`}
              aria-selected={active}
            >
              <button
                type="button"
                tabIndex={-1}
                className="hp-row"
                onClick={() => onSelect(hit.slug)}
                onMouseEnter={() => onHover(index)}
                style={{
                  width: "100%",
                  margin: 0,
                  textAlign: "left",
                  background: active ? "rgba(128,128,128,.12)" : undefined,
                }}
              >
                <div
                  className="hp-im"
                  style={{ width: 88, aspectRatio: "4/3" }}
                >
                  <Image src={hit.heroImageUrl} alt="" fill sizes="96px" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 lang={textLang(hit.title_am, locale)}>
                    <Highlight text={text} query={query} />
                  </h3>
                  {hit.subcategory && (
                    <div className="hp-loc">{hit.subcategory}</div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
