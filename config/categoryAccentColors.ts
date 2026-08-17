export const categoryAccentColors: Record<string, string> = {
  news: "manuscript-red",
  politics: "manuscript-red",
  culture: "aksum-gold",
  entertainment: "terracotta",
  lifestyle: "terracotta",
  "business-tech": "lalibela-blue",
  technology: "lalibela-blue",
  magazine: "obsidian-grey",
  opinion: "obsidian-grey",
};

export function getAccentColor(categorySlug: string): string {
  return categoryAccentColors[categorySlug] ?? "obsidian-grey";
}