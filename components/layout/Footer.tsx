import "../homepage/home.css"; // theme colours
import "./footer.css";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandX,
} from "@tabler/icons-react";
import { getSiteSettings } from "@/content/cms/fetchers/getSiteSettings";
import { footerColumns } from "@/config/headerNav";
import { Emblem } from "./header/Emblem";
import { BackToTop, FooterLang } from "./FooterTools";
import { DataSaverToggle } from "./DataSaver";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations();
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const tagline =
    locale === "am" && settings.tagline_am
      ? settings.tagline_am
      : settings.tagline_en;

  const socials = [
    { url: settings.twitterUrl, label: "X", Icon: IconBrandX },
    { url: settings.facebookUrl, label: "Facebook", Icon: IconBrandFacebook },
    {
      url: settings.instagramUrl,
      label: "Instagram",
      Icon: IconBrandInstagram,
    },
    { url: settings.whatsappUrl, label: "WhatsApp", Icon: IconBrandWhatsapp },
  ].filter((s) => s.url);

  return (
    <footer className="ft">
      <div className="ft-w">
        <div className="ft-top">
          <div className="ft-brand">
            <Link
              href={`/${locale}`}
              className="ft-logo"
              aria-label={settings.siteName}
            >
              <Emblem className="ft-emb" />
              <span className="ft-name hp-serif">{settings.siteName}</span>
            </Link>
            <p className="ft-tag">{tagline}</p>

            {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="ft-mail">
                {settings.contactEmail}
              </a>
            )}

            {socials.length > 0 && (
              <div className="ft-soc">
                {socials.map(({ url, label, Icon }) => (
                  <a
                    key={label}
                    href={url!}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={17} stroke={1.8} />
                  </a>
                ))}
              </div>
            )}

            <Link href={`/${locale}/newsletters`} className="ft-cta">
              Get the morning brief →
            </Link>
          </div>

          {footerColumns.map((col) => (
            <nav key={col.title} className="ft-col" aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link href={`/${locale}/${l.path}`}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="ft-bottom">
          <p>
            &copy; {year} {settings.siteName}. {t("footer.rights")}
          </p>
          <div className="ft-legal">
            <Link href={`/${locale}/privacy`}>Privacy</Link>
            <DataSaverToggle locale={locale} className="ft-saver" />
            <FooterLang locale={locale} />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
