// ArticleBodyRich.tsx
import { clsx } from "clsx";
import "./article-body-rich.css";

export function ArticleBodyRich({
  html,
  lang = "en",
}: {
  html: string;
  lang?: "en" | "am";
}) {
  return (
    <div
      lang={lang}
      className={clsx(
        "article-body-rich max-w-content mx-auto px-6 mt-8",
        lang === "am" ? "font-body-am" : "font-body-en",
        "text-[length:var(--text-body)] leading-[var(--leading-en-body)]",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
