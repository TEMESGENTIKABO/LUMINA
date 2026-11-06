import { formatEthiopianDate } from "@/lib/ethiopianCalendar";

// The server runs in UTC, but readers are in Ethiopia (UTC+3). Without this,
// the header date would be a day behind from 00:00 to 03:00 Addis time.
export function getAddisNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" })
  );
}

export function getDateLines(locale: string) {
  const now = getAddisNow();
  const greg = now.toLocaleDateString(locale === "am" ? "am-ET" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const eth = formatEthiopianDate(now, locale === "am" ? "am" : "en");
  return { greg, eth };
}
