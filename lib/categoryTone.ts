const gold = { bg: "#f6c453", fg: "#1a1405" };
const TONES: Record<string, { bg: string; fg: string }> = {
  ethiopia: gold,
  news: gold,
  politics: { bg: "#b91c1c", fg: "#fff" },
  world: { bg: "#4338ca", fg: "#fff" },
  africa: { bg: "#15803d", fg: "#fff" },
  analysis: { bg: "#475569", fg: "#fff" },
  business: { bg: "#1d4ed8", fg: "#fff" },
  "business-tech": { bg: "#1d4ed8", fg: "#fff" },
  markets: { bg: "#1d4ed8", fg: "#fff" },
  startups: { bg: "#0e7490", fg: "#fff" },
  technology: { bg: "#0f766e", fg: "#fff" },
  science: { bg: "#0369a1", fg: "#fff" },
  culture: { bg: "#6d28d9", fg: "#fff" },
  lifestyle: { bg: "#be185d", fg: "#fff" },
  entertainment: { bg: "#be185d", fg: "#fff" },
  music: { bg: "#be185d", fg: "#fff" },
  education: { bg: "#15803d", fg: "#fff" },
  travel: { bg: "#b45309", fg: "#fff" },
  magazine: { bg: "#9a3412", fg: "#fff" },
  opinion: { bg: "#334155", fg: "#fff" },
  investigations: { bg: "#7f1d1d", fg: "#fff" },
};
export function categoryTone(slug?: string) {
  return TONES[(slug ?? "").toLowerCase()] ?? gold;
}
