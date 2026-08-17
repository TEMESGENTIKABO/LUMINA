"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublishDirectly } from "@/lib/admin/permissions";

const videoSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  title_en: z.string().min(1),
  description_en: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  videoUrl: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  category: z.string().min(1),
  accentColor: z.string().default("obsidian-grey"),
  published: z.boolean().default(false),
});

function parseVideoForm(formData: FormData) {
  return videoSchema.safeParse({
    slug: formData.get("slug"),
    title_en: formData.get("title_en"),
    description_en: formData.get("description_en"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    videoUrl: formData.get("videoUrl"),
    durationSeconds: parseInt(formData.get("durationSeconds") as string) || 0,
    category: formData.get("category"),
    accentColor: formData.get("accentColor") || "obsidian-grey",
    published: formData.get("published") === "on",
  });
}

export async function createVideo(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.video.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: "A video with this slug already exists" };

  const video = await prisma.video.create({
    data: {
      slug: parsed.data.slug,
      title_en: parsed.data.title_en,
      description_en: parsed.data.description_en,
      thumbnailUrl: parsed.data.thumbnailUrl,
      videoUrl: parsed.data.videoUrl,
      durationSeconds: parsed.data.durationSeconds,
      category: parsed.data.category,
      accentColor: parsed.data.accentColor,
      published,
      publishedAt: published ? new Date() : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/videos");
  redirect(`/admin/videos/${video.id}`);
}

export async function updateVideo(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.video.findUnique({ where: { id } });
  if (!existing) return { error: "Video not found" };

  await prisma.video.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      title_en: parsed.data.title_en,
      description_en: parsed.data.description_en,
      thumbnailUrl: parsed.data.thumbnailUrl,
      videoUrl: parsed.data.videoUrl,
      durationSeconds: parsed.data.durationSeconds,
      category: parsed.data.category,
      accentColor: parsed.data.accentColor,
      published,
      publishedAt:
        !existing.published && published ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/videos");
  revalidatePath(`/admin/videos/${id}`);
  revalidatePath("/en/videos");
  revalidatePath("/am/videos");
  return { success: true };
}

export async function deleteVideo(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  await prisma.video.delete({ where: { id } });
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function getVideos() {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return { videos };
}

export async function getVideo(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!video) return { error: "Video not found" };
  return { video };
}

export async function bulkDeleteVideos(ids: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };
  await prisma.video.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/videos");
  revalidatePath("/en/video-podcast");
  return { success: true, count: ids.length };
}
