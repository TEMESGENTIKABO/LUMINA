import { prisma } from "@/lib/prisma";

export async function getAllShows() {
  return prisma.podcastShow.findMany({ orderBy: { title: "asc" } });
}

export async function getShowBySlug(slug: string) {
  const show = await prisma.podcastShow.findUnique({ where: { slug } });
  if (!show) return null;
  const episodes = await prisma.podcastEpisode.findMany({
    where: { showId: show.id, published: true },
    orderBy: { episodeNumber: "desc" },
  });
  return { show, episodes };
}

export async function getEpisodeBySlug(showSlug: string, episodeSlug: string) {
  const show = await prisma.podcastShow.findUnique({ where: { slug: showSlug } });
  if (!show) return null;
  const episode = await prisma.podcastEpisode.findUnique({
    where: { showId_slug: { showId: show.id, slug: episodeSlug } },
  });
  return episode?.published ? { show, episode } : null;
}
