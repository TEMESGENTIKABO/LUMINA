import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getHomeLabels, pickText, textLang } from "@/lib/homeLabels";
import type { Article } from "@/content/types/Article";

export interface DiscussionItem {
  article: Article;
  commentCount: number;
}

/**
 * Ranked list of the stories people are talking about.
 * Styles live in homepage/home-upgrade.css (.hp-list, .hp-cnt, .hp-empty).
 */
export function DiscussionList({
  items,
  locale,
  limit = 5,
  emptyAction,
}: {
  items: DiscussionItem[];
  locale: string;
  limit?: number;
  /** Optional CTA under the empty message, e.g. a link to the latest news. */
  emptyAction?: React.ReactNode;
}) {
  const L = getHomeLabels(locale);
  const shown = items.slice(0, limit);

  if (shown.length === 0) {
    return (
      <div className="hp-empty">
        <p style={{ margin: 0 }}>{L.noDiscussion}</p>
        {emptyAction && <div style={{ marginTop: 10 }}>{emptyAction}</div>}
      </div>
    );
  }

  return (
    <ul className="hp-list">
      {shown.map(({ article, commentCount }) => (
        <li key={article.slug}>
          <Link href={`/${locale}/article/${article.slug}`}>
            <div className="hp-list-main">
              <h3 lang={textLang(article.title_am, locale)}>
                {pickText(article.title_en, article.title_am, locale)}
              </h3>
              <div className="hp-loc">
                {article.subcategory ?? article.category}
              </div>
            </div>
            <span className="hp-cnt" aria-label={L.comments(commentCount)}>
              <MessageSquare size={12} aria-hidden />
              {commentCount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
