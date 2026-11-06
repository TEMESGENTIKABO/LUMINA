import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "./getSiteSettings";

// A scheduled theme that is active right now wins; otherwise the admin's default.
export const getActiveTheme = cache(async () => {
  const settings = await getSiteSettings();
  const now = new Date();
  const active = await prisma.themeSchedule.findFirst({
    where: { startsAt: { lte: now }, endsAt: { gt: now } },
    orderBy: { startsAt: "desc" },
  });
  return active?.theme ?? settings.headerTheme;
});
