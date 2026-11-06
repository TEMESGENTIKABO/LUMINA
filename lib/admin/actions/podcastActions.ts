"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublishDirectly } from "@/lib/admin/permissions";

// Podcast Show Schema
const showSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  title: z.string().min(1),
  description: z.string().min(1),
  coverImageUrl: z.string().min(1),
});

function parseShowForm(formData: FormData) {
  return showSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl"),
  });
}

// Podcast Episode Schema
const episodeSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  showId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  audioUrl: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  episodeNumber: z.number().int().positive(),
  published: z.boolean().default(false),
});

function parseEpisodeForm(formData: FormData) {
  return episodeSchema.safeParse({
    slug: formData.get("slug"),
    showId: formData.get("showId"),
    title: formData.get("title"),
    description: formData.get("description"),
    audioUrl: formData.get("audioUrl"),
    durationSeconds: parseInt(formData.get("durationSeconds") as string) || 0,
    episodeNumber: parseInt(formData.get("episodeNumber") as string) || 0,
    published: formData.get("published") === "on",
  });
}

// ============ SHOW FUNCTIONS ============

export async function createShow(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseShowForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.podcastShow.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: "A show with this slug already exists" };

  const show = await prisma.podcastShow.create({
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description,
      coverImageUrl: parsed.data.coverImageUrl,
    },
  });

  revalidatePath("/admin/podcast");
  redirect(`/admin/podcast/${show.id}`);
}

export async function updateShow(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseShowForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.podcastShow.findUnique({ where: { id } });
  if (!existing) return { error: "Show not found" };

  await prisma.podcastShow.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description,
      coverImageUrl: parsed.data.coverImageUrl,
    },
  });

  revalidatePath("/admin/podcast");
  revalidatePath(`/admin/podcast/${id}`);
  revalidatePath("/en/podcast");
  revalidatePath("/am/podcast");
  return { success: true };
}

export async function deleteShow(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Check if show has episodes
  const episodeCount = await prisma.podcastEpisode.count({
    where: { showId: id },
  });

  if (episodeCount > 0) {
    return {
      error: `Cannot delete show with ${episodeCount} existing episodes. Delete all episodes first.`,
    };
  }

  await prisma.podcastShow.delete({ where: { id } });
  revalidatePath("/admin/podcast");
  return { success: true };
}

export async function getShows() {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const shows = await prisma.podcastShow.findMany({
    orderBy: { title: "asc" },
    include: {
      episodes: {
        orderBy: { episodeNumber: "asc" },
      },
    },
  });

  return { shows };
}

export async function getShow(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const show = await prisma.podcastShow.findUnique({
    where: { id },
    include: {
      episodes: {
        orderBy: { episodeNumber: "asc" },
      },
    },
  });

  if (!show) return { error: "Show not found" };
  return { show };
}

// ============ EPISODE FUNCTIONS ============

export async function createEpisode(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseEpisodeForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.podcastEpisode.findUnique({
    where: {
      showId_slug: {
        showId: parsed.data.showId,
        slug: parsed.data.slug,
      },
    },
  });
  if (existing)
    return { error: "An episode with this slug already exists in this show" };

  const episode = await prisma.podcastEpisode.create({
    data: {
      slug: parsed.data.slug,
      showId: parsed.data.showId,
      title: parsed.data.title,
      description: parsed.data.description,
      audioUrl: parsed.data.audioUrl,
      durationSeconds: parsed.data.durationSeconds,
      episodeNumber: parsed.data.episodeNumber,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/podcast");
  revalidatePath(`/admin/podcast/${parsed.data.showId}`);
  redirect(`/admin/podcast/episode/${episode.id}`);
}

export async function updateEpisode(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseEpisodeForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.podcastEpisode.findUnique({ where: { id } });
  if (!existing) return { error: "Episode not found" };

  await prisma.podcastEpisode.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      showId: parsed.data.showId,
      title: parsed.data.title,
      description: parsed.data.description,
      audioUrl: parsed.data.audioUrl,
      durationSeconds: parsed.data.durationSeconds,
      episodeNumber: parsed.data.episodeNumber,
      published,
      publishedAt:
        !existing.published && published ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/podcast");
  revalidatePath(`/admin/podcast/${parsed.data.showId}`);
  revalidatePath(`/admin/podcast/episode/${id}`);
  revalidatePath("/en/podcast");
  revalidatePath("/am/podcast");
  return { success: true };
}

export async function deleteEpisode(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const episode = await prisma.podcastEpisode.findUnique({
    where: { id },
    select: { showId: true },
  });

  if (!episode) return { error: "Episode not found" };

  await prisma.podcastEpisode.delete({ where: { id } });

  revalidatePath("/admin/podcast");
  revalidatePath(`/admin/podcast/${episode.showId}`);
  revalidatePath("/en/podcast");
  revalidatePath("/am/podcast");
  return { success: true };
}

export async function getEpisodes(showId?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const where = showId ? { showId } : {};

  const episodes = await prisma.podcastEpisode.findMany({
    where,
    orderBy: { episodeNumber: "asc" },
    include: {
      show: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });

  return { episodes };
}

export async function getEpisode(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const episode = await prisma.podcastEpisode.findUnique({
    where: { id },
    include: {
      show: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImageUrl: true,
        },
      },
    },
  });

  if (!episode) return { error: "Episode not found" };
  return { episode };
}

export async function bulkDeleteEpisodes(ids: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };
  await prisma.podcastEpisode.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/podcast");
  revalidatePath("/en/podcast");
  return { success: true, count: ids.length };
}
