import { Suspense } from "react";
import { HeaderRoot } from "./header/HeaderRoot";
import { WeatherBadge } from "./header/WeatherBadge";
import { hdLabels } from "./header/utils";
import { getAddisNow } from "@/lib/addisNow";
import { formatEthiopianDate } from "@/lib/ethiopianCalendar";
import { getSiteSettings } from "@/content/cms/fetchers/getSiteSettings";

interface BreakingItem {
  title: string;
  href: string;
}

export async function Header({
  locale,
  breakingItems,
  theme,
}: {
  locale: string;
  breakingItems?: BreakingItem[];
  theme?: number;
}) {
  // Same source the footer uses, so the admin "site name" drives both.
  const settings = await getSiteSettings();
  const defaultVariant =
    theme ?? (Number(process.env.NEXT_PUBLIC_HEADER_VARIANT) || 1);
  const now = getAddisNow();
  const dateLabel = now.toLocaleDateString(
    locale === "am" ? "am-ET" : "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );
  const ethLabel = formatEthiopianDate(now, locale === "am" ? "am" : "en");

  return (
    <>
      {/* Needs <main id="main-content"> somewhere in your layout. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[90] focus:rounded-sm focus:bg-black focus:px-3 focus:py-1.5 focus:text-xs focus:text-white"
      >
        {hdLabels(locale).skip}
      </a>
      <HeaderRoot
        siteName={settings.siteName}
        locale={locale}
        items={breakingItems ?? []}
        defaultVariant={defaultVariant}
        dateLabel={dateLabel}
        ethLabel={ethLabel}
        weather={
          <Suspense fallback={null}>
            <WeatherBadge locale={locale} />
          </Suspense>
        }
      />
    </>
  );
}
