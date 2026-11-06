import Link from "next/link";
import { SaveButton } from "./SaveButton";
import { FontSizeControl } from "./FontSizeControl";
import { ReadAloudButton } from "./ReadAloudButton";
import { AddToReadingListButton } from "./AddToReadingListButton";

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
  bodyText,
  title, // Added title prop
}: {
  authorName: string;
  authorSlug: string;
  locale: string;
  articleSlug: string;
  publishedAt: string;
  updatedAt?: string;
  readTimeMinutes: number;
  bodyText: string;
  title: string; // Required title prop
}) {
  return (
    <div className="art-col mt-6 flex items-center justify-between gap-3 border-y border-obsidian-grey/10 py-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/author/${authorSlug}`}
          className="w-9 h-9 rounded-full bg-obsidian-grey/10 flex-shrink-0"
        />
        <div className="font-ui text-[length:var(--text-meta)] text-obsidian-grey">
          <p>
            By{" "}
            <Link
              href={`/${locale}/author/${authorSlug}`}
              className="text-aksum-black hover:text-manuscript-red"
            >
              {authorName}
            </Link>{" "}
            - {formatDate(publishedAt)} - {readTimeMinutes} min read
          </p>
          {updatedAt && (
            <p className="mt-0.5">Updated {formatDate(updatedAt)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ReadAloudButton text={bodyText} lang={locale === "am" ? "am" : "en"} />
        <FontSizeControl />
        <SaveButton articleSlug={articleSlug} locale={locale} />
        <AddToReadingListButton slug={articleSlug} title={title} />
      </div>
    </div>
  );
}
