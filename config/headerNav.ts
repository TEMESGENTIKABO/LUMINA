export type IconKey =
  | "star"
  | "politics"
  | "business"
  | "tech"
  | "globe"
  | "analysis"
  | "film"
  | "music"
  | "style"
  | "heritage"
  | "startup"
  | "work"
  | "book"
  | "opinion"
  | "video"
  | "paper"
  | "mail"
  | "search";

export interface HeaderSub {
  label: string;
  path: string;
  icon: IconKey;
}
export interface HeaderNavItem {
  key: string;
  label: string;
  labelAm: string; // TODO: have a native Amharic speaker check these
  altLabel?: string; // style 1 calls "World" → "Global", as in your reference
  path: string; // route under /[locale]/
  preview?: string; // category slug used for the 3 story cards ("news/ethiopia" or "news")
  match: string[]; // route prefixes that mark this item as active
  subs?: HeaderSub[];
}

export const headerNav: HeaderNavItem[] = [
  { key: "home", label: "Home", labelAm: "መነሻ", path: "", match: [] },
  {
    key: "ethiopia",
    label: "Ethiopia",
    labelAm: "ኢትዮጵያ",
    path: "news/ethiopia",
    preview: "news/ethiopia",
    match: ["news/ethiopia", "news/politics"],
    subs: [
      { label: "Top Stories", path: "news/ethiopia", icon: "star" },
      { label: "Politics", path: "news/politics", icon: "politics" },
      { label: "Africa", path: "news/africa", icon: "globe" },
      { label: "Analysis", path: "news/analysis", icon: "analysis" },
    ],
  },
  {
    key: "world",
    label: "World",
    altLabel: "Global",
    labelAm: "ዓለም",
    path: "news/world",
    preview: "news/world",
    match: ["news/world", "news/africa", "news/analysis"],
    subs: [
      { label: "Top Stories", path: "news/world", icon: "star" },
      { label: "Africa", path: "news/africa", icon: "globe" },
      { label: "Analysis", path: "news/analysis", icon: "analysis" },
    ],
  },
  {
    key: "business",
    label: "Business",
    labelAm: "ንግድ",
    path: "business-tech/markets",
    preview: "business-tech/markets",
    match: [
      "business-tech/markets",
      "business-tech/startups",
      "business-tech/diaspora-business",
    ],
    subs: [
      {
        label: "Markets & Economy",
        path: "business-tech/markets",
        icon: "business",
      },
      { label: "Startups", path: "business-tech/startups", icon: "startup" },
      {
        label: "Diaspora Business",
        path: "business-tech/diaspora-business",
        icon: "work",
      },
    ],
  },
  {
    key: "technology",
    label: "Technology",
    labelAm: "ቴክኖሎጂ",
    path: "business-tech/technology",
    preview: "business-tech/technology",
    match: ["business-tech/technology"],
    subs: [
      { label: "Technology", path: "business-tech/technology", icon: "tech" },
      { label: "Startups", path: "business-tech/startups", icon: "startup" },
    ],
  },
  {
    key: "lifestyle",
    label: "Life & Style",
    labelAm: "አኗኗር",
    path: "culture/lifestyle",
    preview: "culture/lifestyle",
    match: ["culture"],
    subs: [
      { label: "Lifestyle", path: "culture/lifestyle", icon: "style" },
      { label: "Entertainment", path: "culture/entertainment", icon: "film" },
      { label: "Music", path: "culture/music", icon: "music" },
      {
        label: "Arts & Heritage",
        path: "culture/arts-heritage",
        icon: "heritage",
      },
    ],
  },
  {
    key: "more",
    label: "More",
    labelAm: "ተጨማሪ",
    path: "magazine",
    preview: "magazine",
    match: [
      "magazine",
      "opinion",
      "investigations",
      "video-podcast",
      "todays-paper",
      "newsletters",
      "events",
    ],
    subs: [
      { label: "Magazine", path: "magazine", icon: "book" },
      { label: "Opinion", path: "opinion", icon: "opinion" },
      { label: "Investigations", path: "investigations", icon: "search" },
      { label: "Video & Podcast", path: "video-podcast", icon: "video" },
      { label: "Today's Paper", path: "todays-paper", icon: "paper" },
      { label: "Newsletters", path: "newsletters", icon: "mail" },
    ],
  },
];

// Top-strip link sets used by styles 4 and 6.
export const stripLinks = {
  news: [
    { label: "News", path: "news" },
    { label: "Analysis", path: "news/analysis" },
    { label: "Opinion", path: "opinion" },
    { label: "Lifestyle", path: "culture/lifestyle" },
  ],
  about: [
    { label: "About", path: "about" },
    { label: "Contact", path: "contact" },
    { label: "Advertise", path: "advertise" },
  ],
};
export const footerColumns = [
  {
    title: "News",
    links: [
      { label: "Ethiopia", path: "news/ethiopia" },
      { label: "World", path: "news/world" },
      { label: "Politics", path: "news/politics" },
      { label: "Africa", path: "news/africa" },
      { label: "Analysis", path: "news/analysis" },
    ],
  },
  {
    title: "Business & Tech",
    links: [
      { label: "Markets & Economy", path: "business-tech/markets" },
      { label: "Startups", path: "business-tech/startups" },
      { label: "Technology", path: "business-tech/technology" },
      { label: "Diaspora Business", path: "business-tech/diaspora-business" },
    ],
  },
  {
    title: "Culture",
    links: [
      { label: "Lifestyle", path: "culture/lifestyle" },
      { label: "Entertainment", path: "culture/entertainment" },
      { label: "Music", path: "culture/music" },
      { label: "Arts & Heritage", path: "culture/arts-heritage" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Magazine", path: "magazine" },
      { label: "Opinion", path: "opinion" },
      { label: "Investigations", path: "investigations" },
      { label: "Video & Podcast", path: "video-podcast" },
      { label: "Today's Paper", path: "todays-paper" },
      { label: "Events", path: "events" },
      { label: "All Topics", path: "topics" },
    ],
  },
];