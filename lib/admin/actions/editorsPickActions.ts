"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageAllArticles } from "@/lib/admin/permissions";
import { revalidatePath } from "next/cache";

export async function setEditorsPicks(articleIds: string[]) {
  const session = await auth();
  if (!session?.user || !canManageAllArticles(session.user.role)) return { error: "Not authorized" };

  await prisma.editorsPick.deleteMany({});
  await prisma.editorsPick.createMany({
    data: articleIds.map((articleId, position) => ({ articleId, position })),
  });

  revalidatePath("/admin/editors-picks");
  revalidatePath("/en");
  revalidatePath("/am");
  return { success: true };
}
