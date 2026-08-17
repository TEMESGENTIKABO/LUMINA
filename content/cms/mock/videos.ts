import type { Video } from "@/content/types/Video";

export const mockVideos: Video[] = [
  {
    slug: "gerd-documentary-part-one",
    title_en: "Inside the Dam: Five Years of GERD",
    description_en: "A documentary look at the communities living alongside the Grand Ethiopian Renaissance Dam.",
    thumbnailUrl: "/images/gerd.svg",
    videoUrl: "",
    durationSeconds: 1380,
    category: "news",
    accentColor: "manuscript-red",
    author: { name: "Selamawit Bekele", slug: "selamawit-bekele" },
    publishedAt: "2026-07-14T09:00:00.000Z",
  },
  {
    slug: "mekelle-goldsmiths",
    title_en: "The Last Goldsmiths of Mekelle",
    description_en: "A short film on the workshop reviving Aksumite granulation techniques.",
    thumbnailUrl: "/images/jewelry.svg",
    videoUrl: "",
    durationSeconds: 620,
    category: "culture",
    accentColor: "aksum-gold",
    author: { name: "Bethlehem Alemu", slug: "bethlehem-alemu" },
    publishedAt: "2026-07-10T09:00:00.000Z",
  },
];