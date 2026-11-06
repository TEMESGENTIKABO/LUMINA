import { Suspense } from "react";
import { HeaderRoot } from "./header/HeaderRoot";
import { WeatherBadge } from "./header/WeatherBadge";
import { getAddisNow } from "@/lib/addisNow";
import { formatEthiopianDate } from "@/lib/ethiopianCalendar";

interface BreakingItem {
  title: string;
  href: string;
}

export function Header({
  locale,
  breakingItems,
  theme,
}: {
  locale: string;
  breakingItems?: BreakingItem[];
  theme?: number;
}) {
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[90] focus:rounded-sm focus:bg-black focus:px-3 focus:py-1.5 focus:text-xs focus:text-white"
      >
        Skip to content
      </a>
      <HeaderRoot
        locale={locale}
        items={breakingItems ?? []}
        defaultVariant={defaultVariant}
        dateLabel={dateLabel}
        ethLabel={ethLabel}
        weather={
          <Suspense fallback={null}>
            <WeatherBadge />
          </Suspense>
        }
      />
    </>
  );
}
