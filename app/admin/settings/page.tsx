import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { ThemeSchedules } from "./ThemeSchedules";
export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });
  const schedules = await prisma.themeSchedule.findMany({
    orderBy: { startsAt: "desc" },
    take: 20,
  });
  // after <SettingsForm …/>:
  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Settings</h1>
      <SettingsForm initial={settings} />
      <ThemeSchedules
        schedules={schedules.map((s) => ({
          id: s.id,
          name: s.name,
          theme: s.theme,
          startsAt: s.startsAt.toISOString(),
          endsAt: s.endsAt.toISOString(),
        }))}
      />
    </div>
  );
}
