/**
 * Bilingual labels + locale-aware formatting for the public pages.
 * Merge these keys into your existing `@/lib/labels` when convenient so the
 * site ends up with ONE translation source instead of several.
 */
export type SiteLocale = "en" | "am";

const en = {
  topStory: "Top story",
  breaking: "Breaking",
  breakingNews: "Breaking news",
  readFull: "Read full story",
  minRead: "min read",
  prev: "Previous story",
  next: "Next story",
  pause: "Pause slideshow",
  play: "Play slideshow",
  topStories: "Top stories",
  storyOf: (n: number, total: number) => `Story ${n} of ${total}`,
  viewAll: "View all",
  dismiss: "Dismiss",
  pauseTicker: "Pause headlines",
  playTicker: "Resume headlines",
  community: "Community",
  mostDiscussed: "Most discussed",
  upcomingEvents: "Upcoming events",
  noDiscussion: "No discussion yet. Open a story to start one.",
  noEvents: "No events scheduled yet.",
  comments: (n: number) => (n === 1 ? "1 comment" : `${n} comments`),
  newsletterTitle: "The morning brief, every day.",
  emailLabel: "Email address",
  emailPlaceholder: "you@email.com",
  subscribe: "Subscribe",
  subscribing: "Subscribing…",
  subscribed: "You're subscribed. Welcome to AKSUM.",
  invalidEmail: "Enter a valid email address.",
  subscribeFailed: "Subscription failed. Check your connection and try again.",
  moreHeadlines: "More headlines",
  trending: "Trending",
  mostRead: "Most read",
  privacy: "Privacy",
  morningBrief: "Get the morning brief",
  alsoRead: "Also read",
  noResults: "No results for",
};

type Labels = typeof en;

const am: Labels = {
  topStory: "ዋና ዜና",
  breaking: "አስቸኳይ",
  breakingNews: "አስቸኳይ ዜና",
  readFull: "ሙሉውን ያንብቡ",
  minRead: "ደቂቃ ንባብ",
  prev: "ቀዳሚ ዜና",
  next: "ቀጣይ ዜና",
  pause: "ማሳያውን አቁም",
  play: "ማሳያውን ቀጥል",
  topStories: "ዋና ዋና ዜናዎች",
  storyOf: (n, total) => `ዜና ${n} ከ${total}`,
  viewAll: "ሁሉንም ይመልከቱ",
  dismiss: "ዝጋ",
  pauseTicker: "ርዕሶችን አቁም",
  playTicker: "ርዕሶችን ቀጥል",
  community: "ማኅበረሰብ",
  mostDiscussed: "ብዙ ውይይት የተደረገባቸው",
  upcomingEvents: "መጪ ዝግጅቶች",
  noDiscussion: "እስካሁን ውይይት የለም። ውይይት ለመጀመር አንድ ዜና ይክፈቱ።",
  noEvents: "እስካሁን የታቀደ ዝግጅት የለም።",
  comments: (n) => `${n} አስተያየት`,
  newsletterTitle: "የጠዋት ማጠቃለያ፣ በየቀኑ።",
  emailLabel: "ኢሜይል አድራሻ",
  emailPlaceholder: "you@email.com",
  subscribe: "ይመዝገቡ",
  subscribing: "በመመዝገብ ላይ…",
  subscribed: "ተመዝግበዋል። ወደ አክሱም እንኳን በደህና መጡ።",
  invalidEmail: "ትክክለኛ ኢሜይል አድራሻ ያስገቡ።",
  subscribeFailed: "ምዝገባው አልተሳካም። ግንኙነትዎን ፈትሸው እንደገና ይሞክሩ።",
  moreHeadlines: "ተጨማሪ ዋና ዋና ዜናዎች",
  trending: "በመታየት ላይ",
  mostRead: "በብዛት የተነበቡ",
  privacy: "ግላዊነት",
  morningBrief: "የጠዋት ማጠቃለያውን ያግኙ",
  alsoRead: "ይህንንም ያንብቡ",
  noResults: "ምንም ውጤት አልተገኘም፦",
};

export function getHomeLabels(locale?: string): Labels {
  return locale === "am" ? am : en;
}

/** Amharic text when it exists and the page is Amharic, otherwise English. */
export function pickText(
  enText: string | null | undefined,
  amText: string | null | undefined,
  locale: string,
): string {
  return (locale === "am" && amText ? amText : enText) ?? "";
}

/** Value for the `lang` attribute of a piece of picked text. */
export function textLang(
  amText: string | null | undefined,
  locale: string,
): SiteLocale {
  return locale === "am" && amText ? "am" : "en";
}

const TZ = "Africa/Addis_Ababa";
const tag = (locale: string) => (locale === "am" ? "am-ET" : "en-US");

/**
 * Locale + timezone aware. Fixes server/client mismatches and gives Amharic
 * month names on /am pages. For the Ethiopian calendar use the tag
 * "am-ET-u-ca-ethiopic" in `tag()`.
 */
export function formatDate(
  value: Date | string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(tag(locale), {
    timeZone: TZ,
    ...options,
  }).format(new Date(value));
}

export function formatTime(value: Date | string, locale: string): string {
  return formatDate(value, locale, { hour: "numeric", minute: "2-digit" });
}
