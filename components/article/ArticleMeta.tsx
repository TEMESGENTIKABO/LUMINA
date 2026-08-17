// ArticleMeta.tsx
import Link from "next/link";
import { SaveButton } from "./SaveButton";
import { Clock, Calendar } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleMeta({
  authorName,
  authorSlug,
  locale,
  articleSlug,
  publishedAt,
  updatedAt,
  readTimeMinutes,
}: {
  authorName: string;
  authorSlug: string;
  locale: string;
  articleSlug: string;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
}) {
  return (
    <div className="max-w-content mx-auto px-6 mt-6">
      <div className="flex items-center justify-between gap-4 border-y border-obsidian-grey/10 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/author/${authorSlug}`}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-aksum-gold/20 to-obsidian-grey/10 flex-shrink-0 overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center text-aksum-gold font-ui text-sm font-medium">
              {authorName.charAt(0)}
            </div>
          </Link>

          <div className="font-ui text-[length:var(--text-meta)]">
            <p className="text-obsidian-grey/70 text-xs uppercase tracking-wider">
              By
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/${locale}/author/${authorSlug}`}
                className="text-aksum-black font-medium hover:text-manuscript-red transition-colors"
              >
                {authorName}
              </Link>

              <span className="text-obsidian-grey/30">·</span>

              <div className="flex items-center gap-1 text-obsidian-grey/60 text-xs">
                <Calendar size={12} />
                <span>{formatDate(publishedAt)}</span>
              </div>

              <span className="text-obsidian-grey/30">·</span>

              <div className="flex items-center gap-1 text-obsidian-grey/60 text-xs">
                <Clock size={12} />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>

            {updatedAt && (
              <p className="text-obsidian-grey/50 text-xs mt-0.5 italic">
                Updated {formatDate(updatedAt)}
              </p>
            )}
          </div>
        </div>

        <SaveButton articleSlug={articleSlug} locale={locale} />
      </div>
    </div>
  );
}
