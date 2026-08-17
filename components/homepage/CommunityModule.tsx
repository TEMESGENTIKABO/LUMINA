import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Article } from "@/content/types/Article";

interface UpcomingEvent {
  slug: string;
  title: string;
  location: string;
  startsAt: Date | string;
}

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CommunityModule({
  discussed,
  events,
  locale,
}: {
  discussed: { article: Article; commentCount: number }[];
  events: UpcomingEvent[];
  locale: string;
}) {
  return (
    <section className="max-w-page mx-auto px-6 py-6">
      <SectionHeader label="Community" />
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
        <div className="md:pr-8">
          <p className="section-label text-obsidian-grey/60 mb-3">Most Discussed</p>
          {discussed.length === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No discussion yet.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {discussed.map(({ article, commentCount }) => (
                <li key={article.slug} className="flex items-center justify-between gap-4 py-2.5">
                  <Link href={`/${locale}/article/${article.slug}`} className="font-body-en text-[length:var(--text-body)] hover:text-manuscript-red transition-colors">
                    {article.title_en}
                  </Link>
                  <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/50 flex-shrink-0 tabular-nums">
                    {commentCount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:pl-8 pt-6 md:pt-0">
          <p className="section-label text-obsidian-grey/60 mb-3">Upcoming Events</p>
          {events.length === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No events scheduled yet.</p>
          ) : (
            <ul className="divide-y divide-hairline">
              {events.slice(0, 4).map((event) => (
                <li key={event.slug} className="py-2.5">
                  <Link href={`/${locale}/events/${event.slug}`} className="group flex items-baseline gap-3">
                    <span className="font-ui text-[length:var(--text-label)] text-obsidian-grey/50 tabular-nums flex-shrink-0">
                      {formatEventDate(event.startsAt)}
                    </span>
                    <span className="font-body-en text-[length:var(--text-body)] group-hover:text-manuscript-red transition-colors">
                      {event.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
