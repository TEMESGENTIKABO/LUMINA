import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
