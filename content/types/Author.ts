export interface Author {
  slug: string;
  name: string;
  bio: string;
  beat: string;       // e.g. "Politics & Policy"
  avatarUrl?: string;
  twitterUrl?: string;
}