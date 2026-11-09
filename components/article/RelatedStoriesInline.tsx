import "@/components/homepage/home.css";
import "@/components/homepage/home-upgrade.css";
import Link from "next/link";
import Image from "next/image";
import { getHomeLabels, pickText, textLang } from "@/lib/homeLabels";
import type { Article } from "@/content/types/Article";

/**
 * Compact "Also read" block that sits inside the article column, between two halves
 * of the body. Pair it with splitHtmlAfterParagraph():
 *
 *   const [first, rest] = splitHtmlAfterParagraph(html, 4);
 *   <ArticleBodyRich html={first} lang={lang} />
 *   {rest && <RelatedStoriesInline articles={related} locale={locale} />}
 *   {rest && <ArticleBodyRich html={rest} lang={lang} />}
 */
export function RelatedStoriesInline({
  articles,
  locale,
  limit = 2,
}: {
  articles: Article[];
  locale: string;
  limit?: number;
}) {
  const items = articles
    .filter((a, i, all) => i === all.findIndex((x) => x.slug === a.slug))
    .slice(0, limit);
  if (items.length === 0) return null;
  const L = getHomeLabels(locale);

  return (
    <aside className="art-col hp-inline" aria-label={L.alsoRead}>
      <p className="hp-inline-h">{L.alsoRead}</p>
      <ul>
        {items.map((a) => (
          <li key={a.slug}>
            <Link href={`/${locale}/article/${a.slug}`}>
              <span className="hp-inline-thumb">
                <Image src={a.heroImageUrl} alt="" fill sizes="96px" />
              </span>
              <span style={{ minWidth: 0 }}>
                <span
                  className="hp-inline-t"
                  lang={textLang(a.title_am, locale)}
                >
                  {pickText(a.title_en, a.title_am, locale)}
                </span>
                <span className="hp-inline-m">
                  <span>{a.subcategory ?? a.category}</span>
                  <span>
                    {a.readTimeMinutes} {L.minRead}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
