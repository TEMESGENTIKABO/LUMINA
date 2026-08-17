import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/content/cms/fetchers/getSiteSettings";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations();
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const tagline = locale === "am" && settings.tagline_am ? settings.tagline_am : settings.tagline_en;

  const socialLinks = [
    { url: settings.twitterUrl, label: "X" },
    { url: settings.facebookUrl, label: "Facebook" },
    { url: settings.instagramUrl, label: "Instagram" },
    { url: settings.whatsappUrl, label: "WhatsApp" },
  ].filter((s) => s.url);

  return (
    <footer className="hairline-t mt-16">
      <div className="max-w-page mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-6">
        <div>
          <p className="font-headline-en text-lg font-bold">{settings.siteName}</p>
          <p className="font-ui text-sm text-obsidian-grey">{tagline}</p>
          {settings.contactEmail && (
            <a href={`mailto:${settings.contactEmail}`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black mt-1 inline-block">
              {settings.contactEmail}
            </a>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex gap-4">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="section-label text-obsidian-grey hover:text-aksum-black">
                {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <Link href={`/${locale}/topics`} className="section-label text-obsidian-grey hover:text-aksum-black">All Topics</Link>
          <Link href={`/${locale}/events`} className="section-label text-obsidian-grey hover:text-aksum-black">Events</Link>
          <Link href={`/${locale}/privacy`} className="section-label text-obsidian-grey hover:text-aksum-black">Privacy</Link>
        </div>

        <p className="font-ui text-sm text-obsidian-grey tabular-nums">
          &copy; {year} {settings.siteName}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
