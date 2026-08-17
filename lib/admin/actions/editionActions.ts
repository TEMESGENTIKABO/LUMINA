"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canPublishDirectly } from "@/lib/admin/permissions";

const editionSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  issueLabel: z.string().min(1),
  coverImageUrl: z.string().min(1),
  headline: z.string().min(1),
  published: z.boolean().default(false),
});

function parseEditionForm(formData: FormData) {
  return editionSchema.safeParse({
    slug: formData.get("slug"),
    issueLabel: formData.get("issueLabel"),
    coverImageUrl: formData.get("coverImageUrl"),
    headline: formData.get("headline"),
    published: formData.get("published") === "on",
  });
}

export async function createEdition(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseEditionForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.digitalEdition.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) return { error: "An edition with this slug already exists" };

  const edition = await prisma.digitalEdition.create({
    data: {
      slug: parsed.data.slug,
      issueLabel: parsed.data.issueLabel,
      coverImageUrl: parsed.data.coverImageUrl,
      headline: parsed.data.headline,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/editions");
  redirect(`/admin/editions/${edition.id}`);
}

export async function updateEdition(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const parsed = parseEditionForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role)
    ? parsed.data.published
    : false;

  const existing = await prisma.digitalEdition.findUnique({ where: { id } });
  if (!existing) return { error: "Edition not found" };

  await prisma.digitalEdition.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      issueLabel: parsed.data.issueLabel,
      coverImageUrl: parsed.data.coverImageUrl,
      headline: parsed.data.headline,
      published,
      publishedAt:
        !existing.published && published ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/admin/editions");
  revalidatePath(`/admin/editions/${id}`);
  revalidatePath("/en/editions");
  revalidatePath("/am/editions");
  return { success: true };
}

export async function deleteEdition(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Check if edition has articles
  const articleCount = await prisma.editionArticle.count({
    where: { editionId: id },
  });

  if (articleCount > 0) {
    return {
      error: `Cannot delete edition with ${articleCount} articles. Remove all articles first.`,
    };
  }

  await prisma.digitalEdition.delete({ where: { id } });
  revalidatePath("/admin/editions");
  return { success: true };
}

export async function getEditions() {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const editions = await prisma.digitalEdition.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      articles: {
        include: {
          article: {
            select: {
              id: true,
              slug: true,
              title_en: true,
              status: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  return { editions };
}

export async function getEdition(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const edition = await prisma.digitalEdition.findUnique({
    where: { id },
    include: {
      articles: {
        include: {
          article: {
            select: {
              id: true,
              slug: true,
              title_en: true,
              title_am: true,
              status: true,
              publishedAt: true,
              author: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!edition) return { error: "Edition not found" };
  return { edition };
}

export async function addArticleToEdition(
  editionId: string,
  articleId: string,
  position?: number,
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const existing = await prisma.editionArticle.findUnique({
    where: {
      editionId_articleId: {
        editionId,
        articleId,
      },
    },
  });

  if (existing) return { error: "Article already in this edition" };

  // If no position provided, add at the end
  if (position === undefined) {
    const maxPosition = await prisma.editionArticle.aggregate({
      where: { editionId },
      _max: { position: true },
    });
    position = (maxPosition._max.position ?? -1) + 1;
  }

  await prisma.editionArticle.create({
    data: {
      editionId,
      articleId,
      position,
    },
  });

  revalidatePath("/admin/editions");
  revalidatePath(`/admin/editions/${editionId}`);
  return { success: true };
}

export async function removeArticleFromEdition(
  editionId: string,
  articleId: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  await prisma.editionArticle.delete({
    where: {
      editionId_articleId: {
        editionId,
        articleId,
      },
    },
  });

  revalidatePath("/admin/editions");
  revalidatePath(`/admin/editions/${editionId}`);
  return { success: true };
}

export async function reorderEditionArticles(
  editionId: string,
  articleIds: string[],
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Update positions in a transaction
  await prisma.$transaction(
    articleIds.map((articleId, index) =>
      prisma.editionArticle.update({
        where: {
          editionId_articleId: {
            editionId,
            articleId,
          },
        },
        data: { position: index },
      }),
    ),
  );

  revalidatePath("/admin/editions");
  revalidatePath(`/admin/editions/${editionId}`);
  return { success: true };
}
