import { prisma } from "@/lib/prisma";

export async function getAllEvents() {
  return prisma.event.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
  });
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({ where: { slug } });
  return event?.published ? event : null;
}
