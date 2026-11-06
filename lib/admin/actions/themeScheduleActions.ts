"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageSettings } from "@/lib/admin/permissions";

async function guard() {
  const session = await auth();
  return !!session?.user && canManageSettings(session.user.role);
}
// Dates are entered in Addis Ababa time (UTC+3).
const addis = (v: string) => new Date(`${v}:00+03:00`);

export async function createThemeSchedule(formData: FormData) {
  if (!(await guard())) return { error: "Not authorized" };
  const name = String(formData.get("name") ?? "").trim();
  const theme = Number(formData.get("theme"));
  const start = String(formData.get("startsAt") ?? "");
  const end = String(formData.get("endsAt") ?? "");
  if (!name || !(theme >= 1 && theme <= 10) || !start || !end)
    return { error: "Fill in every field." };
  const startsAt = addis(start);
  const endsAt = addis(end);
  if (!(endsAt > startsAt))
    return { error: "The end must be after the start." };

  await prisma.themeSchedule.create({
    data: { name, theme, startsAt, endsAt },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteThemeSchedule(id: string) {
  if (!(await guard())) return { error: "Not authorized" };
  await prisma.themeSchedule.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
