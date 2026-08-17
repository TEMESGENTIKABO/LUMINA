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
