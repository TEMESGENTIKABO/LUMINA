import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import { HeaderAuthStatus } from "./HeaderAuthStatus";
import { IconBrandWhatsapp, IconBrandTelegram, IconBrandX } from "@tabler/icons-react";
import { DarkModeToggle } from "./DarkModeToggle";
function formatMasthead(locale: string) {
  return new Date().toLocaleDateString(locale === "am" ? "am-ET" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "https://wa.me/251912345678", icon: IconBrandWhatsapp },
  { label: "Telegram", href: "https://t.me/aksummedia", icon: IconBrandTelegram },
  { label: "X", href: "https://x.com/aksummedia", icon: IconBrandX },
];

function SocialRow() {
  return (
    <div className="hidden sm:flex items-center gap-3">
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="
            text-neutral-500 hover:text-white
            transition-all duration-200 ease-out
            hover:-translate-y-0.5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm
          "
        >
          <Icon size={14} strokeWidth={1.9} />
        </a>
      ))}
    </div>
  );
}

export function UtilityBar({ locale }: { locale: string }) {
  const dateStr = formatMasthead(locale);

  return (
    <div className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4">
        {/* Left — Edition metadata */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span className="shrink-0 text-[10px] font-bold tracking-[0.12em] text-neutral-500 uppercase">
            Aksum
          </span>
          <span className="hidden sm:inline-block w-px h-3 bg-neutral-800 shrink-0" />
          <time
            dateTime={new Date().toISOString()}
            className="text-[11px] font-medium tracking-wide tabular-nums text-neutral-500 truncate"
            suppressHydrationWarning
          >
            {dateStr}
          </time>
          <span className="hidden md:inline-block w-px h-3 bg-neutral-800 shrink-0" />
          <span className="hidden md:inline text-[11px] text-neutral-600 truncate">
            Addis Ababa
          </span>
        </div>

        {/* Center — Today's Paper (desktop only) */}
        <Link
          href={`/${locale}/todays-paper`}
          className="hidden lg:block text-[11px] text-neutral-500 hover:text-white transition-colors tracking-wide"
        >
          Today&apos;s Paper
        </Link>

        {/* Right — Social, Tools & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <SocialRow />

          <span className="hidden sm:inline-block w-px h-3 bg-neutral-800" />

          <LanguageToggle currentLocale={locale} />
          <DarkModeToggle />
          <span className="hidden sm:inline-block w-px h-3 bg-neutral-800" />

          <HeaderAuthStatus locale={locale} />

          <Link
            href={`/${locale}/membership`}
            className="ml-1 sm:ml-2 inline-flex items-center px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[11px] font-bold tracking-wide transition-colors rounded-sm"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  );
}