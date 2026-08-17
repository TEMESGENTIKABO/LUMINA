"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageTaxonomy, canPublishDirectly } from "@/lib/admin/permissions";

const eventSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphenated"),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
  startsAt: z.string().min(1, "Start date/time is required"),
  published: z.boolean().default(false),
});

function parseEventForm(formData: FormData) {
  return eventSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    imageUrl: formData.get("imageUrl") || undefined,
    startsAt: formData.get("startsAt"),
    published: formData.get("published") === "on",
  });
}

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };

  const parsed = parseEventForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await prisma.event.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "An event with this slug already exists" };

  const published = canPublishDirectly(session.user.role) ? parsed.data.published : false;

  await prisma.event.create({
    data: { ...parsed.data, published, startsAt: new Date(parsed.data.startsAt) },
  });

  revalidatePath("/admin/events");
  revalidatePath("/en/events");
  revalidatePath("/am/events");
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };

  const parsed = parseEventForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const published = canPublishDirectly(session.user.role) ? parsed.data.published : false;

  await prisma.event.update({
    where: { id },
    data: { ...parsed.data, published, startsAt: new Date(parsed.data.startsAt) },
  });

  revalidatePath("/admin/events");
  revalidatePath("/en/events");
  revalidatePath("/am/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/en/events");
  revalidatePath("/am/events");
  return { success: true };
}

export async function bulkDeleteEvents(ids: string[]) {
  const session = await auth();
  if (!session?.user || !canManageTaxonomy(session.user.role)) return { error: "Not authorized" };
  await prisma.event.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/admin/events");
  revalidatePath("/en/events");
  revalidatePath("/am/events");
  return { success: true, count: ids.length };
}
