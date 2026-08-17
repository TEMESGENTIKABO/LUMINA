import type { PodcastShow, PodcastEpisode } from "@/content/types/PodcastEpisode";

export const mockShows: PodcastShow[] = [
  {
    slug: "the-addis-brief",
    title: "The Addis Brief",
    description: "Weekly conversations on Ethiopian politics, business, and culture.",
    coverImageUrl: "/images/startup.svg",
  },
];

export const mockEpisodes: PodcastEpisode[] = [
  {
    slug: "episode-12-gerd-negotiations",
    showSlug: "the-addis-brief",
    title: "Episode 12: Where the GERD Negotiations Actually Stand",
    description: "Selamawit Bekele joins to unpack the current state of diplomacy around the dam.",
    audioUrl: "",
    durationSeconds: 2640,
    publishedAt: "2026-07-18T05:00:00.000Z",
    episodeNumber: 12,
  },
  {
    slug: "episode-11-addis-startups",
    showSlug: "the-addis-brief",
    title: "Episode 11: Building for Addis First",
    description: "A conversation with three founders building fintech products for the domestic market.",
    audioUrl: "",
    durationSeconds: 2280,
    publishedAt: "2026-07-11T05:00:00.000Z",
    episodeNumber: 11,
  },
];