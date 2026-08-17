import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, topics, photoStories, events, editions, videos, shows] = await Promise.all([
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.topic.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.photoStory.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.digitalEdition.findMany({ where: { published: true }, select: { slug: true, createdAt: true } }),
    prisma.video.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.podcastShow.findMany({ select: { slug: true } }),
  ]);

  const staticRoutes = ["", "/news", "/culture", "/business-tech", "/magazine", "/opinion", "/investigations", "/topics", "/photo-story", "/events", "/video-podcast", "/podcast", "/magazine/editions", "/todays-paper", "/privacy"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["en", "am"]) {
    for (const route of staticRoutes) {
      entries.push({ url: `${SITE_URL}/${locale}${route}`, changeFrequency: "daily", priority: route === "" ? 1 : 0.6 });
    }
    for (const cat of categories) {
      entries.push({ url: `${SITE_URL}/${locale}/${cat.slug}`, changeFrequency: "daily", priority: 0.6 });
    }
    for (const article of articles) {
      entries.push({ url: `${SITE_URL}/${locale}/article/${article.slug}`, lastModified: article.updatedAt, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const topic of topics) {
      entries.push({ url: `${SITE_URL}/${locale}/topics/${topic.slug}`, lastModified: topic.updatedAt, changeFrequency: "weekly", priority: 0.5 });
    }
    for (const story of photoStories) {
      entries.push({ url: `${SITE_URL}/${locale}/photo-story/${story.slug}`, lastModified: story.updatedAt, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const event of events) {
      entries.push({ url: `${SITE_URL}/${locale}/events/${event.slug}`, lastModified: event.updatedAt, changeFrequency: "weekly", priority: 0.4 });
    }
    for (const edition of editions) {
      entries.push({ url: `${SITE_URL}/${locale}/magazine/editions/${edition.slug}`, lastModified: edition.createdAt, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const video of videos) {
      entries.push({ url: `${SITE_URL}/${locale}/video/${video.slug}`, lastModified: video.updatedAt, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const show of shows) {
      entries.push({ url: `${SITE_URL}/${locale}/podcast/${show.slug}`, changeFrequency: "weekly", priority: 0.5 });
    }
  }

  return entries;
}
