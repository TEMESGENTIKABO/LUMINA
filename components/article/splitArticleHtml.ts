const PAIRS: [open: RegExp, close: RegExp][] = [
  [/<blockquote\b/gi, /<\/blockquote>/gi],
  [/<(ul|ol)\b/gi, /<\/(ul|ol)>/gi],
  [/<figure\b/gi, /<\/figure>/gi],
  [/<table\b/gi, /<\/table>/gi],
];

const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;
const balanced = (html: string) =>
  PAIRS.every(([o, c]) => count(html, o) === count(html, c));

/**
 * Splits CMS HTML after the n-th paragraph so a block (e.g. RelatedStoriesInline)
 * can sit between the two halves. Never splits inside a quote, list, figure or table,
 * and returns [html, ""] when too little text would remain for the split to make sense.
 */
export function splitHtmlAfterParagraph(
  html: string,
  n = 4,
  minRest = 400,
): [string, string] {
  let from = 0;
  let seen = 0;
  while (true) {
    const end = html.indexOf("</p>", from);
    if (end === -1) return [html, ""];
    const cut = end + 4;
    from = cut;
    if (!balanced(html.slice(0, cut))) continue;
    if (++seen < n) continue;
    const rest = html.slice(cut);
    if (rest.replace(/<[^>]*>/g, "").trim().length < minRest) return [html, ""];
    return [html.slice(0, cut), rest];
  }
}
