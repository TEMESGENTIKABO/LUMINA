"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageSettings } from "@/lib/admin/permissions";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline_en: z.string().min(1),
  tagline_am: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  whatsappUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageSettings(session.user.role)) {
    return { error: "Not authorized" };
  }

  const parsed = settingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline_en: formData.get("tagline_en"),
    tagline_am: formData.get("tagline_am") || undefined,
    defaultSeoDescription: formData.get("defaultSeoDescription") || undefined,
    contactEmail: formData.get("contactEmail") || "",
    twitterUrl: formData.get("twitterUrl") || "",
    facebookUrl: formData.get("facebookUrl") || "",
    instagramUrl: formData.get("instagramUrl") || "",
    whatsappUrl: formData.get("whatsappUrl") || "",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
