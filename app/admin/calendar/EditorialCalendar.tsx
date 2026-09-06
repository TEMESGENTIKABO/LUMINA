"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface CalendarArticle {
  id: string;
  title_en: string;
  status: string;
  scheduledAt: Date | string | null;
  publishedAt: Date | string | null;
  author: { name: string | null; email: string | null };
}

export function EditorialCalendar({
  year,
  month,
  articles,
}: {
  year: number;
  month: number;
  articles: CalendarArticle[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const monthName = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const byDay = new Map<number, CalendarArticle[]>();
  for (const article of articles) {
    const relevantDate = article.status === "PUBLISHED" ? article.publishedAt : article.scheduledAt;
    if (!relevantDate) continue;
    const day = new Date(relevantDate).getDate();
    byDay.set(day, [...(byDay.get(day) ?? []), article]);
  }

  function navigate(delta: number) {
    const newDate = new Date(year, month + delta, 1);
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", String(newDate.getFullYear()));
    params.set("month", String(newDate.getMonth()));
    router.push(`/admin/calendar?${params.toString()}`);
  }

  const cells: (number | null)[] = [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-en text-xl">{monthName}</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">Previous</button>
          <button onClick={() => navigate(1)} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-obsidian-grey/10 border border-obsidian-grey/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-obsidian-grey/5 py-2 text-center font-ui text-xs uppercase tracking-wide text-obsidian-grey">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="bg-parchment-white min-h-[100px] p-2">
            {day && (
              <>
                <p className="font-ui text-xs text-obsidian-grey/50 tabular-nums">{day}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {(byDay.get(day) ?? []).map((a) => (
                    <Link
                      key={a.id}
                      href={`/admin/articles/${a.id}`}
                      className={`block font-ui text-[10px] leading-tight px-1.5 py-1 truncate ${a.status === "PUBLISHED" ? "bg-manuscript-red/10 text-manuscript-red" : "bg-aksum-gold/10 text-aksum-gold"}`}
                      title={a.title_en}
                    >
                      {a.title_en}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <span className="flex items-center gap-1.5 font-ui text-xs text-obsidian-grey">
          <span className="w-2.5 h-2.5 bg-aksum-gold/30 inline-block" /> Scheduled
        </span>
        <span className="flex items-center gap-1.5 font-ui text-xs text-obsidian-grey">
          <span className="w-2.5 h-2.5 bg-manuscript-red/30 inline-block" /> Published
        </span>
      </div>
    </div>
  );
}
