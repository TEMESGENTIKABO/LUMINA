import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { ThemeSchedules } from "./ThemeSchedules";
import { PageHeader } from "@/components/admin/ui";

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

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader eyebrow="Configuration" title="Settings">
        Your site&apos;s identity, search presence, social links and look.
      </PageHeader>

      <SettingsForm initial={settings} />

      <div className="mt-12">
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
    </div>
  );
}
