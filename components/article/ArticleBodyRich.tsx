import "./article-body-rich.css";
import "./article-modern.css";

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
      className={`article-body-rich art-col art-prose ${lang === "am" ? "font-body-am" : "font-body-en"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
