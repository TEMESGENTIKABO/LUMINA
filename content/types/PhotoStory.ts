export interface PhotoStoryImage {
  url: string;
  caption: string;
}

export interface PhotoStory {
  slug: string;
  title: string;
  intro: string;
  author: { name: string; slug: string };
  publishedAt: string;
  images: PhotoStoryImage[];
}