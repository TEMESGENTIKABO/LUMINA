export interface Video {
  slug: string;
  title_en: string;
  description_en: string;
  thumbnailUrl: string;
  videoUrl: string;          // for now, a direct video file or embed URL
  durationSeconds: number;
  category: string;
  accentColor: string;
  author: { name: string; slug: string };
  publishedAt: string;
}