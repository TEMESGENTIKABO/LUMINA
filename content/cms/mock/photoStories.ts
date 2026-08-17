import type { PhotoStory } from "@/content/types/PhotoStory";

export const mockPhotoStories: PhotoStory[] = [
  {
    slug: "goldsmiths-of-mekelle",
    title: "Goldsmiths of Mekelle: A Photo Essay",
    intro: "Inside the small workshop reviving 1,700-year-old Aksumite metalworking techniques.",
    author: { name: "Bethlehem Alemu", slug: "bethlehem-alemu" },
    publishedAt: "2026-07-12T08:00:00.000Z",
    images: [
      { url: "/images/jewelry.svg", caption: "The workshop's main bench, early morning light." },
      { url: "/images/jewelry.svg", caption: "A granulation pattern in progress." },
      { url: "/images/jewelry.svg", caption: "The finished piece, modeled on a 4th-century coin." },
    ],
  },
];