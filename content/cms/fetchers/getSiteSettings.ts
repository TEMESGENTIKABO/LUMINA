import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteSettings = cache(async () =>
  prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  }),
);
