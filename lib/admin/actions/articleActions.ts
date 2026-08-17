"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  canManageAllArticles,
  getAllowedStatuses,
} from "@/lib/admin/permissions";
import { logAdminAction } from "@/lib/admin/auditLog";

const articleSchema = z.object({
  title_en: z.string().min(1, "Title is required"),
  title_am: z.string().optional(),
  dek_en: z.string().min(1, "Dek is required"),
  dek_am: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).default([]),
  topicIds: z.array(z.string()).default([]),
  heroImageUrl: z.string().optional(),
  heroImageCaption: z.string().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  scheduledAt: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  readTimeMinutes: z.coerce.number().min(1).default(5),
  authorId: z.string().optional(),
  isBreaking: z.boolean().default(false), // Added isBreaking to schema
});

type ArticleFormData = z.infer<typeof articleSchema> & {
  body_en: object;
  body_am: any;
};

type ArticleFormResult =
  { data: ArticleFormData; error?: never } | { error: string; data?: never };

function parseArticleForm(
  formData: FormData,
  bodyJson: object,
): ArticleFormResult {
  const tagIds = formData.getAll("tagIds") as string[];
  const topicIds = formData.getAll("topicIds") as string[];

  const parsed = articleSchema.safeParse({
    title_en: formData.get("title_en"),
    title_am: formData.get("title_am") || undefined,
    dek_en: formData.get("dek_en"),
    dek_am: formData.get("dek_am") || undefined,
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    tagIds,
    topicIds,
    heroImageUrl: formData.get("heroImageUrl") || undefined,
    heroImageCaption: formData.get("heroImageCaption") || undefined,
    status: formData.get("status"),
    scheduledAt: formData.get("scheduledAt") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    ogImageUrl: formData.get("ogImageUrl") || undefined,
    readTimeMinutes: formData.get("readTimeMinutes") || 5,
    authorId: formData.get("authorId") || undefined,
    isBreaking: formData.get("isBreaking") === "on", // Parse checkbox value
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (parsed.data.status === "SCHEDULED" && !parsed.data.scheduledAt) {
    return { error: "Scheduled articles need a scheduled date/time" };
  }

  // Parse body_am from form data
  const bodyAmRaw = formData.get("body_am");
  const body_am = bodyAmRaw ? JSON.parse(bodyAmRaw as string) : null;

  return { data: { ...parsed.data, body_en: bodyJson, body_am } };
}

export async function createArticle(bodyJson: object, formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const result = parseArticleForm(formData, bodyJson);
  if ("error" in result) return { error: result.error };
  const { data } = result;

  const allowedStatuses = getAllowedStatuses(session.user.role);
  if (!allowedStatuses.includes(data.status)) {
    return {
      error: `Your role can only set status to: ${allowedStatuses.join(", ")}`,
    };
  }

  const existing = await prisma.article.findUnique({
    where: { slug: data.slug },
  });
  if (existing) return { error: "An article with this slug already exists" };

  const authorId =
    canManageAllArticles(session.user.role) && data.authorId
      ? data.authorId
      : session.user.id;

  const article = await prisma.article.create({
    data: {
      title_en: data.title_en,
      title_am: data.title_am,
      dek_en: data.dek_en,
      dek_am: data.dek_am,
      slug: data.slug,
      body_en: data.body_en as any,
      body_am: data.body_am as any,
      categoryId: data.categoryId,
      heroImageUrl: data.heroImageUrl,
      heroImageCaption: data.heroImageCaption,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImageUrl: data.ogImageUrl,
      readTimeMinutes: data.readTimeMinutes,
      authorId,
      isBreaking: data.isBreaking, // Added isBreaking to create
      tags: { create: data.tagIds.map((tagId) => ({ tagId })) },
      topics: { create: data.topicIds.map((topicId: string) => ({ topicId })) },
    },
  });

  await logAdminAction({
    actorId: session.user.id,
    actionType: "CREATED",
    contentType: "Article",
    contentId: article.id,
    contentLabel: article.title_en,
  });

  await prisma.articleRevision.create({
    data: {
      articleId: article.id,
      title_en: data.title_en,
      dek_en: data.dek_en,
      body_en: data.body_en as any,
      status: data.status,
      editedById: session.user.id,
    },
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}`);
}

export async function updateArticle(
  id: string,
  bodyJson: object,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const existingArticle = await prisma.article.findUnique({ where: { id } });
  if (!existingArticle) return { error: "Article not found" };

  const isOwner = existingArticle.authorId === session.user.id;
  if (!isOwner && !canManageAllArticles(session.user.role)) {
    return { error: "You can only edit your own articles" };
  }

  const result = parseArticleForm(formData, bodyJson);
  if (result.error) return { error: result.error };
  const { data } = result;

  const allowedStatuses = getAllowedStatuses(session.user.role);
  if (!allowedStatuses.includes(data.status)) {
    return {
      error: `Your role can only set status to: ${allowedStatuses.join(", ")}`,
    };
  }

  if (data.slug !== existingArticle.slug) {
    const slugTaken = await prisma.article.findUnique({
      where: { slug: data.slug },
    });
    if (slugTaken) return { error: "An article with this slug already exists" };
  }

  const wasPublished = existingArticle.status === "PUBLISHED";
  const isNowPublished = data.status === "PUBLISHED";

  // Snapshot the state BEFORE overwriting
  await prisma.articleRevision.create({
    data: {
      articleId: id,
      title_en: data.title_en,
      dek_en: data.dek_en,
      body_en: data.body_en as any,
      status: data.status,
      editedById: session.user.id,
    },
  });

  const authorId =
    canManageAllArticles(session.user.role) && data.authorId
      ? data.authorId
      : session.user.id;

  await prisma.article.update({
    where: { id },
    data: {
      title_en: data.title_en,
      title_am: data.title_am,
      dek_en: data.dek_en,
      dek_am: data.dek_am,
      slug: data.slug,
      body_en: data.body_en as any,
      body_am: data.body_am as any,
      categoryId: data.categoryId,
      heroImageUrl: data.heroImageUrl,
      heroImageCaption: data.heroImageCaption,
      status: data.status,
      publishedAt:
        !wasPublished && isNowPublished
          ? new Date()
          : existingArticle.publishedAt,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImageUrl: data.ogImageUrl,
      readTimeMinutes: data.readTimeMinutes,
      isBreaking: data.isBreaking, // Added isBreaking to update
      ...(canManageAllArticles(session.user.role) && data.authorId
        ? { authorId }
        : {}),

      // Tags - properly defined at top level
      tags: {
        deleteMany: {},
        create: data.tagIds.map((tagId) => ({ tagId })),
      },

      // Topics - properly defined at top level (NOT nested inside tags)
      topics: {
        deleteMany: {},
        create: data.topicIds.map((topicId: string) => ({ topicId })),
      },
    },
  });

  await logAdminAction({
    actorId: session.user.id,
    actionType:
      data.status === "PUBLISHED" && existingArticle.status !== "PUBLISHED"
        ? "PUBLISHED"
        : "UPDATED",
    contentType: "Article",
    contentId: id,
    contentLabel: data.title_en,
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/en");
  revalidatePath("/am");
  revalidatePath(`/en/article/${data.slug}`);
  revalidatePath(`/am/article/${data.slug}`);
  return { success: true };
}

export async function deleteArticle(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { error: "Article not found" };

  const isOwner = article.authorId === session.user.id;
  if (!isOwner && !canManageAllArticles(session.user.role)) {
    return { error: "You can only delete your own articles" };
  }

  await logAdminAction({
    actorId: session.user.id,
    actionType: "DELETED",
    contentType: "Article",
    contentId: article.id,
    contentLabel: article.title_en,
  });

  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  return { success: true };
}

export async function restoreRevision(articleId: string, revisionId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return { error: "Article not found" };

  const isOwner = article.authorId === session.user.id;
  if (!isOwner && !canManageAllArticles(session.user.role)) {
    return { error: "Not authorized to restore this article" };
  }

  const revision = await prisma.articleRevision.findUnique({
    where: { id: revisionId },
  });
  if (!revision || revision.articleId !== articleId)
    return { error: "Revision not found" };

  // Restoring is itself a new save - snapshot current state first, then apply the old one, then snapshot that too.
  await prisma.articleRevision.create({
    data: {
      articleId,
      title_en: article.title_en,
      dek_en: article.dek_en,
      body_en: article.body_en as any,
      status: article.status,
      editedById: session.user.id,
    },
  });

  await prisma.article.update({
    where: { id: articleId },
    data: {
      title_en: revision.title_en,
      dek_en: revision.dek_en,
      body_en: revision.body_en as any,
    },
  });

  await prisma.articleRevision.create({
    data: {
      articleId,
      title_en: revision.title_en,
      dek_en: revision.dek_en,
      body_en: revision.body_en as any,
      status: article.status,
      editedById: session.user.id,
    },
  });

  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath(`/admin/articles/${articleId}/history`);
  return { success: true };
}

export async function bulkUpdateStatus(
  articleIds: string[],
  newStatus: string,
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const allowedStatuses = getAllowedStatuses(session.user.role);
  if (!allowedStatuses.includes(newStatus)) {
    return {
      error: `Your role can only set status to: ${allowedStatuses.join(", ")}`,
    };
  }

  const articles = await prisma.article.findMany({
    where: { id: { in: articleIds } },
  });
  const canManageAll = canManageAllArticles(session.user.role);
  const unauthorized = articles.filter(
    (a) => a.authorId !== session.user.id && !canManageAll,
  );
  if (unauthorized.length > 0) {
    return {
      error: `You do not have permission to change ${unauthorized.length} of the selected articles`,
    };
  }

  await prisma.article.updateMany({
    where: { id: { in: articleIds } },
    data: {
      status: newStatus as any,
      publishedAt: newStatus === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/en");
  revalidatePath("/am");
  return { success: true, count: articleIds.length };
}

export async function bulkDeleteArticles(articleIds: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const articles = await prisma.article.findMany({
    where: { id: { in: articleIds } },
  });
  const canManageAll = canManageAllArticles(session.user.role);
  const unauthorized = articles.filter(
    (a) => a.authorId !== session.user.id && !canManageAll,
  );
  if (unauthorized.length > 0) {
    return {
      error: `You do not have permission to delete ${unauthorized.length} of the selected articles`,
    };
  }

  await prisma.article.deleteMany({ where: { id: { in: articleIds } } });
  revalidatePath("/admin/articles");
  return { success: true, count: articleIds.length };
}
