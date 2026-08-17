"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageTaxonomy } from "@/lib/admin/permissions";
import { logAdminAction } from "@/lib/admin/auditLog";

const categorySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  name_en: z.string().min(1),
  name_am: z.string().optional(),
  accentColor: z.string().min(1),
  parentId: z.string().optional(),
});

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    slug: formData.get("slug"),
    name_en: formData.get("name_en"),
    name_am: formData.get("name_am") || undefined,
    accentColor: formData.get("accentColor"),
    parentId: formData.get("parentId") || undefined,
  });
}

export async function createCategory(formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role))
    return { error: "Not authorized" };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: "A category with this slug already exists" };

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role))
    return { error: "Not authorized" };

  const parsed = parseCategoryForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (parsed.data.parentId === id)
    return { error: "A category cannot be its own parent" };

  // Check for circular parent relationships
  if (parsed.data.parentId) {
    let currentId: string | null = parsed.data.parentId;
    const visited = new Set<string>();
    while (currentId) {
      if (currentId === id)
        return { error: "This would create a circular parent relationship" };
      if (visited.has(currentId)) break; // already-corrupt data elsewhere - stop rather than loop forever
      visited.add(currentId);
      const parent: { parentId: string | null } | null =
        await prisma.category.findUnique({
          where: { id: currentId },
          select: { parentId: true },
        });
      currentId = parent?.parentId ?? null;
    }
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role))
    return { error: "Not authorized" };

  const articleCount = await prisma.article.count({
    where: { categoryId: id },
  });
  if (articleCount > 0)
    return {
      error: `Cannot delete: ${articleCount} article(s) still use this category`,
    };

  const childCount = await prisma.category.count({ where: { parentId: id } });
  if (childCount > 0)
    return {
      error: `Cannot delete: ${childCount} subcategory(ies) still reference this category`,
    };

  const category = await prisma.category.findUnique({ where: { id } });
  if (category) {
    await logAdminAction({
      actorId: session.user.id,
      actionType: "DELETED",
      contentType: "Category",
      contentId: id,
      contentLabel: category.name_en,
    });
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}
