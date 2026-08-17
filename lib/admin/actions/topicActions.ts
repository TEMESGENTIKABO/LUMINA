"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageTaxonomy, canPublishDirectly } from "@/lib/admin/permissions";

const topicSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphenated"),
  title: z.string().min(1),
  description: z.string().min(1),
  published: z.boolean().default(false),
});

export async function createTopic(formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };

  const parsed = topicSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.topic.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A topic with this slug already exists" };

  const published = canPublishDirectly(session.user.role) ? parsed.data.published : false;

  await prisma.topic.create({ data: { ...parsed.data, published } });
  revalidatePath("/admin/topics");
  revalidatePath("/en/topics");
  revalidatePath("/am/topics");
  return { success: true };
}

export async function deleteTopic(id: string) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };
  await prisma.topic.delete({ where: { id } });
  revalidatePath("/admin/topics");
  revalidatePath("/en/topics");
  revalidatePath("/am/topics");
  return { success: true };
}

export async function linkArticleToTopic(articleId: string, topicId: string) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };

  const existing = await prisma.articleTopic.findUnique({
    where: { articleId_topicId: { articleId, topicId } },
  });

  if (existing) {
    await prisma.articleTopic.delete({ where: { articleId_topicId: { articleId, topicId } } });
    revalidatePath("/admin/topics");
    return { linked: false };
  }

  await prisma.articleTopic.create({ data: { articleId, topicId } });
  revalidatePath("/admin/topics");
  return { linked: true };
}
