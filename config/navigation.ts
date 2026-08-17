export interface NavSubItem {
  label: string;
  path: string; // full path segment(s) after the locale, e.g. "news/politics" or "opinion"
}

export interface NavItem {
  labelKey: string;
  slug: string;
  accent: string;
  subItems?: NavSubItem[];
}

export const primaryNav: NavItem[] = [
  {
    labelKey: "nav.news",
    slug: "news",
    accent: "manuscript-red",
    subItems: [
      { label: "Ethiopia", path: "news/ethiopia" },
      { label: "Politics", path: "news/politics" },
      { label: "Africa", path: "news/africa" },
      { label: "World", path: "news/world" },
      { label: "Analysis", path: "news/analysis" },
    ],
  },
  {
    labelKey: "nav.culture",
    slug: "culture",
    accent: "aksum-gold",
    subItems: [
      { label: "Entertainment", path: "culture/entertainment" },
      { label: "Music", path: "culture/music" },
      { label: "Film & TV", path: "culture/film-tv" },
      { label: "Lifestyle", path: "culture/lifestyle" },
      { label: "Arts & Heritage", path: "culture/arts-heritage" },
    ],
  },
  {
    labelKey: "nav.businessTech",
    slug: "business-tech",
    accent: "lalibela-blue",
    subItems: [
      { label: "Markets & Economy", path: "business-tech/markets" },
      { label: "Startups", path: "business-tech/startups" },
      { label: "Technology", path: "business-tech/technology" },
      { label: "Diaspora Business", path: "business-tech/diaspora-business" },
    ],
  },
  {
    labelKey: "nav.magazine",
    slug: "magazine",
    accent: "obsidian-grey",
    subItems: [
      { label: "Opinion", path: "opinion" },
      { label: "Investigations", path: "investigations" },
      { label: "Digital Editions", path: "magazine/editions" },
      { label: "Magazine Home", path: "magazine" },
    ],
  },
  {
  labelKey: "nav.videoPodcast",
  slug: "video-podcast",
  accent: "terracotta",
  subItems: [
    { label: "Documentaries", path: "video-podcast" },
    { label: "Podcasts", path: "podcast" },
    { label: "Photo Stories", path: "photo-story" },
  ],
},
];