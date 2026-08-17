"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublishDirectly } from "@/lib/admin/permissions";

const imageSchema = z.object({ url: z.string().min(1), caption: z.string().default("") });

const photoStorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphenated"),
  title: z.string().min(1),
  intro: z.string().min(1),
  published: z.boolean().default(false),
  images: z.array(imageSchema).min(1, "At least one image is required"),
});

function parsePhotoStoryForm(formData: FormData) {
  const imageUrls = formData.getAll("imageUrl") as string[];
  const imageCaptions = formData.getAll("imageCaption") as string[];
  const images = imageUrls
    .map((url, i) => ({ url, caption: imageCaptions[i] ?? "" }))
    .filter((img) => img.url.trim());

  return photoStorySchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    intro: formData.get("intro"),
    published: formData.get("published") === "on",
    images,
  });
}

export async function createPhotoStory(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parsePhotoStoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.photoStory.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A photo story with this slug already exists" };

  const published = canPublishDirectly(session.user.role) ? parsed.data.published : false;

  const story = await prisma.photoStory.create({
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      intro: parsed.data.intro,
      images: parsed.data.images as any,
      published,
      publishedAt: published ? new Date() : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/photo-stories");
  redirect(`/admin/photo-stories/${story.id}`);
}

export async function updatePhotoStory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parsePhotoStoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.photoStory.findUnique({ where: { id } });
  if (!existing) return { error: "Photo story not found" };

  const published = canPublishDirectly(session.user.role) ? parsed.data.published : false;

  await prisma.photoStory.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      intro: parsed.data.intro,
      images: parsed.data.images as any,
      published,
      publishedAt: !existing.published && published ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/photo-stories");
  revalidatePath(`/admin/photo-stories/${id}`);
  revalidatePath("/en/photo-story");
  revalidatePath("/am/photo-story");
  return { success: true };
}

export async function deletePhotoStory(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };
  await prisma.photoStory.delete({ where: { id } });
  revalidatePath("/admin/photo-stories");
  return { success: true };
}
