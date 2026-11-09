import type { HeaderNavItem } from "@/config/headerNav";

/* ------------------------------------------------------------------ labels */

const en = {
  // chrome
  subscribe: "Subscribe",
  menu: "Menu",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  skip: "Skip to content",
  home: "Home",
  primary: "Primary",
  secondary: "Secondary",
  // ticker
  breaking: "Breaking",
  breakingTail: "News",
  live: "Live",
  latest: "Latest",
  prevHeadline: "Previous headline",
  nextHeadline: "Next headline",
  pauseHeadlines: "Pause headlines",
  playHeadlines: "Resume headlines",
  // date / weather
  ec: "EC",
  city: "Addis Ababa",
  // mega menu + drawer
  explore: "Explore",
  viewAll: "View all",
  latestIn: (section: string) => `Latest in ${section}`,
  noStories: "No stories yet in this section.",
  sectionMenu: "section menu",
  expand: "Expand",
  collapse: "Collapse",
  newsletters: "Newsletters",
  newsletterCta: "Get the daily briefing",
  newsletterSub: "The stories that matter, in your inbox.",
  // search
  search: "Search",
  searchPh: "Search stories, topics, people…",
  searchFor: (q: string) => `Search for “${q}”`,
  jumpTo: "Go to section",
  recent: "Recent searches",
  sections: "Browse sections",
  clear: "Clear",
  close: "Close",
  // account
  signIn: "Sign in",
  account: "My account",
  saved: "Saved articles",
  following: "Following",
  admin: "Admin dashboard",
  signOut: "Sign out",
  guest: "Welcome",
  guestSub: "Sign in to save stories and follow topics.",
};

export type HdLabels = typeof en;

// Amharic: only strings that are safe are translated; anything left out falls
// back to English via the spread. Please have a native editor review this block.
const am: HdLabels = {
  ...en,
  subscribe: "ይመዝገቡ",
  menu: "ምናሌ",
  openMenu: "ምናሌ ክፈት",
  closeMenu: "ምናሌ ዝጋ",
  skip: "ወደ ዋናው ይዘት ዝለል",
  home: "መነሻ ገጽ",
  breaking: "ሰበር ዜና",
  breakingTail: "",
  live: "ቀጥታ",
  latest: "አዳዲስ",
  prevHeadline: "ቀዳሚ ዜና",
  nextHeadline: "ቀጣይ ዜና",
  pauseHeadlines: "ዜናዎችን አቁም",
  playHeadlines: "ዜናዎችን ቀጥል",
  ec: "ዓ.ም",
  city: "አዲስ አበባ",
  explore: "ያስሱ",
  viewAll: "ሁሉንም ይመልከቱ",
  latestIn: (section: string) => `የ${section} አዳዲስ ዜናዎች`,
  noStories: "በዚህ ክፍል እስካሁን ዜና የለም።",
  newsletterCta: "ዕለታዊ ዜናዎችን በኢሜይል ያግኙ",
  search: "ፍለጋ",
  searchPh: "ዜናዎችን፣ ርዕሶችን፣ ሰዎችን ይፈልጉ…",
  searchFor: (q: string) => `“${q}” ፈልግ`,
  jumpTo: "ወደ ክፍል ሂድ",
  recent: "የቅርብ ጊዜ ፍለጋዎች",
  sections: "ክፍሎችን ያስሱ",
  clear: "አጽዳ",
  close: "ዝጋ",
  signIn: "ይግቡ",
  account: "መለያ",
  saved: "የተቀመጡ ጽሑፎች",
  following: "የሚከተሏቸው",
  signOut: "ይውጡ",
  guest: "እንኳን ደህና መጡ",
  guestSub: "ዜናዎችን ለማስቀመጥ እና ርዕሶችን ለመከተል ይግቡ።",
};

export const hdLabels = (locale: string): HdLabels =>
  locale === "am" ? am : en;

/** Wrapper class: palette (`hd-vN`) + an Amharic hook for type tweaks. */
export const hdClass = (variant: number, locale: string) =>
  `hd hd-v${variant}${locale === "am" ? " hd-l-am" : ""}`;

/* ----------------------------------------------------------------- helpers */

export function initialsOf(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  const out =
    parts.length > 1
      ? parts[0][0] + parts[1][0]
      : Array.from(src).slice(0, 2).join("");
  return out.toUpperCase();
}

export type NavSub = NonNullable<HeaderNavItem["subs"]>[number];

export const navHref = (locale: string, path: string) =>
  path ? `/${locale}/${path}` : `/${locale}`;

export function isNavActive(
  item: HeaderNavItem,
  pathname: string,
  locale: string,
) {
  const rest = pathname.replace(new RegExp(`^/${locale}/?`), "");
  return item.key === "home"
    ? rest === ""
    : item.match.some((m) => rest === m || rest.startsWith(m + "/"));
}

export function navLabel(
  item: HeaderNavItem,
  locale: string,
  preferAlt: boolean,
) {
  if (locale === "am") return item.labelAm;
  return preferAlt && item.altLabel ? item.altLabel : item.label;
}

/** Sub-links have no Amharic label in the config yet; if you add `labelAm`
 *  to them this picks it up automatically, otherwise it shows English. */
export function subLabel(sub: { label: string }, locale: string) {
  const am = (sub as { labelAm?: string }).labelAm;
  return locale === "am" && am ? am : sub.label;
}
