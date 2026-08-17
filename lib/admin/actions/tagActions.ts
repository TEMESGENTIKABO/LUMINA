"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageTaxonomy } from "@/lib/admin/permissions";

const tagSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  name: z.string().min(1),
});

export async function createTag(formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) {
    return { error: "Not authorized" };
  }

  const parsed = tagSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.tag.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A tag with this slug already exists" };

  await prisma.tag.create({ data: parsed.data });
  revalidatePath("/admin/tags");
  return { success: true };
}

export async function deleteTag(id: string) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) {
    return { error: "Not authorized" };
  }

  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
  return { success: true };
}
