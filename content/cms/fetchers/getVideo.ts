import { prisma } from "@/lib/prisma";

function mapVideo(v: any) {
  return {
    ...v,
    author: {
      name: v.author.name ?? v.author.email ?? "AKSUM Staff",
      slug: v.author.slug ?? v.author.id,
    },
  };
}

export async function getAllVideos() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });
  return videos.map(mapVideo);
}

export async function getVideoBySlug(slug: string) {
  const video = await prisma.video.findUnique({
    where: { slug },
    include: { author: true },
  });
  return video?.published ? mapVideo(video) : null;
}
