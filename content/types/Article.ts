export interface Article {
  slug: string;
  category: string;         // e.g. "news", "culture"
  subcategory?: string;      // e.g. "politics"
  accentColor: string;       // Tailwind color token name, e.g. "manuscript-red"

  title_en: string;
  title_am?: string;
  dek_en: string;            // subheadline
  dek_am?: string;

  author: {
    name: string;
    slug: string;
    avatarUrl?: string;
  };

  heroImageUrl: string;
  heroImageCaption?: string;

  publishedAt: string;       // ISO date
  updatedAt?: string;
  readTimeMinutes: number;

  isBreaking?: boolean;
}