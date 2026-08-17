"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/apiKeyAuth";
import { canManageSettings } from "@/lib/admin/permissions";
import { revalidatePath } from "next/cache";

export async function createApiKey(name: string) {
  const session = await auth();
  if (!session?.user || !canManageSettings(session.user.role)) return { error: "Not authorized" };
  if (!name.trim()) return { error: "Name is required" };

  const { key, hash, preview } = generateApiKey();
  await prisma.apiKey.create({
    data: { name: name.trim(), keyHash: hash, keyPreview: preview, userId: session.user.id },
  });

  revalidatePath("/admin/api-keys");
  // The real, unhashed key is returned exactly once - it is never stored or
  // retrievable again after this call, same principle as any real API provider.
  return { success: true, key };
}

export async function revokeApiKey(id: string) {
  const session = await auth();
  if (!session?.user || !canManageSettings(session.user.role)) return { error: "Not authorized" };
  await prisma.apiKey.delete({ where: { id } });
  revalidatePath("/admin/api-keys");
  return { success: true };
}
