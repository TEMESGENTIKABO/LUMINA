export interface ThemeInfo { id: number; name: string; note: string; strip: string; bar: string; dark: boolean; accent: string; panel: string }

export const THEMES: ThemeInfo[] = [
  { id: 1, name: "Premium & Elegant", note: "Dark header, gold accents", strip: "#090c14", bar: "#090c14", dark: true, accent: "#f6c453", panel: "#faf8f3" },
  { id: 2, name: "Modern & Clean", note: "White, blue accents", strip: "#ffffff", bar: "#ffffff", dark: false, accent: "#2457d6", panel: "#ffffff" },
  { id: 3, name: "Bold & Dynamic", note: "Deep navy with amber", strip: "#0a1226", bar: "#0a1226", dark: true, accent: "#f6b92b", panel: "#0a1226" },
  { id: 4, name: "Minimalist Cream", note: "Warm cream, bronze", strip: "#f7f2e8", bar: "#f7f2e8", dark: false, accent: "#b8862b", panel: "#f5efe3" },
  { id: 5, name: "Vibrant & Trendy", note: "Purple to magenta", strip: "#2a0b66", bar: "linear-gradient(95deg,#2b0a6b,#6b21a8 52%,#c2257f)", dark: true, accent: "#d62a84", panel: "#7a1d8f" },
  { id: 6, name: "Classic Magazine", note: "Black strip, gold, red", strip: "#0b0b0b", bar: "#ffffff", dark: false, accent: "#c99a3d", panel: "#ffffff" },
  { id: 7, name: "Newsroom", note: "One dark bar, weather inline", strip: "#0a1020", bar: "linear-gradient(180deg,#0c1527,#080e1c)", dark: true, accent: "#f6c453", panel: "#0b1424" },
  { id: 8, name: "Broadsheet", note: "Centred serif masthead, burgundy", strip: "#fbf7ee", bar: "#fbf7ee", dark: false, accent: "#7a1c2b", panel: "#fbf7ee" },
  { id: 9, name: "Heritage", note: "Ethiopian green, yellow, red", strip: "#06502b", bar: "#ffffff", dark: false, accent: "#0a6b2d", panel: "#ffffff" },
  { id: 10, name: "Midnight", note: "Floating glass bar, cyan", strip: "#05070f", bar: "#0e1222", dark: true, accent: "#22d3ee", panel: "#0b0f1f" },
];
export const THEME_COUNT = THEMES.length;