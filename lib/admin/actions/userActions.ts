"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/admin/permissions";
import { logAdminAction } from "@/lib/admin/auditLog";

const roleSchema = z.enum(["SUBSCRIBER", "AUTHOR", "EDITOR", "ADMIN"]);

export async function updateUserRole(userId: string, newRole: string) {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    return { error: "Not authorized" };
  }

  const parsed = roleSchema.safeParse(newRole);
  if (!parsed.success) return { error: "Invalid role" };

  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser) return { error: "User not found" };

  // Prevent removing the last remaining Admin - would lock everyone out of user management.
  if (targetUser.role === "ADMIN" && parsed.data !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { error: "Cannot demote the last remaining Admin" };
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data },
  });

  await logAdminAction({
    actorId: session.user.id,
    actionType: "ROLE_CHANGED",
    contentType: "User",
    contentId: userId,
    contentLabel: `${targetUser.email ?? userId}: ${targetUser.role} -> ${parsed.data}`,
  });

  revalidatePath("/admin/users");
  return { success: true, isSelf: userId === session.user.id };
}
