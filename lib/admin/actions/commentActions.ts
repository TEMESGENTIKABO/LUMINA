"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  articleSlug: z.string().min(1),
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment is too long"),
});

export async function createComment(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "You must be signed in to comment" };

  const parsed = commentSchema.safeParse({
    articleSlug: formData.get("articleSlug"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.comment.create({
    data: { articleSlug: parsed.data.articleSlug, content: parsed.data.content, userId: session.user.id },
  });

  revalidatePath(`/en/article/${parsed.data.articleSlug}`);
  revalidatePath(`/am/article/${parsed.data.articleSlug}`);
  return { success: true };
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return { error: "Comment not found" };

  const isOwner = comment.userId === session.user.id;
  const isModerator = session.user.role === "ADMIN" || session.user.role === "EDITOR";
  if (!isOwner && !isModerator) return { error: "Not authorized" };

  await prisma.comment.delete({ where: { id } });
  revalidatePath(`/en/article/${comment.articleSlug}`);
  revalidatePath(`/am/article/${comment.articleSlug}`);
  return { success: true };
}

export async function bulkDeleteComments(commentIds: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };
  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return { error: "Only Editors and Admins can bulk-moderate comments" };
  }

  const comments = await prisma.comment.findMany({ where: { id: { in: commentIds } } });
  await prisma.comment.deleteMany({ where: { id: { in: commentIds } } });

  const slugs = Array.from(new Set(comments.map((c) => c.articleSlug)));
  for (const slug of slugs) {
    revalidatePath(`/en/article/${slug}`);
    revalidatePath(`/am/article/${slug}`);
  }
  return { success: true, count: commentIds.length };
}
