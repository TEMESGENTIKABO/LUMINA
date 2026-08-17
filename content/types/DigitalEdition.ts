export interface DigitalEdition {
  slug: string;
  issueLabel: string; // e.g. "July 2026"
  coverImageUrl: string;
  headline: string;
  articleSlugs: string[]; // references into mockArticles
}