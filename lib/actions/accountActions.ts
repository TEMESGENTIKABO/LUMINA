"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/admin/permissions";

export async function deleteOwnAccount() {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized" };

  // Prevent the last remaining Admin from deleting themselves and locking
  // everyone out of user management - same principle as the demotion guard.
  if (session.user.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { error: "You are the last Admin. Promote another user to Admin before deleting your account." };
    }
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: "/en" });
  return { success: true };
}
