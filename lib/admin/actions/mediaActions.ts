"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteMedia(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { error: "Media not found" };

  if (media.uploadedById !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "You can only delete your own uploads" };
  }

  await del(media.url);
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { success: true };
}

export async function bulkDeleteMedia(ids: string[]) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  const items = await prisma.media.findMany({ where: { id: { in: ids } } });
  const isAdmin = session.user.role === "ADMIN";
  const unauthorized = items.filter((m) => m.uploadedById !== session.user.id && !isAdmin);
  if (unauthorized.length > 0) {
    return { error: `You can only delete your own uploads (${unauthorized.length} item(s) belong to other users)` };
  }

  for (const item of items) {
    await del(item.url).catch(() => {});
  }
  await prisma.media.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/media");
  return { success: true, count: ids.length };
}
