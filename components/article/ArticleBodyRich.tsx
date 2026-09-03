import "./article-body-rich.css";

export function ArticleBodyRich({ html, lang = "en" }: { html: string; lang?: "en" | "am" }) {
  return (
    <div
      lang={lang}
      className={`article-body-rich max-w-content mx-auto px-6 mt-8 ${lang === "am" ? "font-body-am" : "font-body-en"}`}
      style={{ fontSize: "calc(var(--text-body) * var(--article-font-scale, 1))" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
