import { prisma } from "@/lib/prisma";

export async function getAllPhotoStories() {
  return prisma.photoStory.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });
}

export async function getPhotoStoryBySlug(slug: string) {
  const story = await prisma.photoStory.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!story || !story.published) return null;

  return {
    slug: story.slug,
    title: story.title,
    intro: story.intro,
    images: story.images as { url: string; caption: string }[],
    author: {
      name: story.author.name ?? story.author.email ?? "AKSUM Staff",
      slug: story.author.slug ?? story.author.id,
    },
  };
}
