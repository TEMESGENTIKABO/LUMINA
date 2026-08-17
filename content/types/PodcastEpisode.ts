export interface PodcastShow {
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
}

export interface PodcastEpisode {
  slug: string;
  showSlug: string;
  title: string;
  description: string;
  audioUrl: string;
  durationSeconds: number;
  publishedAt: string;
  episodeNumber: number;
}