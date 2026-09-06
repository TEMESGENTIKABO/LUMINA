import { getCalendarArticles } from "@/lib/admin/getEditorialCalendar";
import { EditorialCalendar } from "./EditorialCalendar";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year ?? now.getFullYear());
  const month = Number(params.month ?? now.getMonth());

  const articles = await getCalendarArticles(year, month);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Editorial Calendar</h1>
      <EditorialCalendar year={year} month={month} articles={articles} />
    </div>
  );
}
