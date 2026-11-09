import "./home.css";
import "./home-upgrade.css";
import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { DiscussionList } from "@/components/community/DiscussionList";
import { formatDate, getHomeLabels } from "@/lib/homeLabels";
import type { Article } from "@/content/types/Article";

interface UpcomingEvent {
  slug: string;
  title: string;
  location: string;
  startsAt: Date | string;
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
  const L = getHomeLabels(locale);

  return (
    <section className="hp-sec" aria-labelledby="community-h">
      <div className="hp-w">
        <SectionHead id="community-h" title={L.community} />
        <div className="hp-pair">
          <div className="hp-panel">
            <p className="hp-sub" role="heading" aria-level={3}>
              {L.mostDiscussed}
            </p>
            <DiscussionList items={discussed} locale={locale} />
          </div>

          <div className="hp-panel">
            <p className="hp-sub" role="heading" aria-level={3}>
              {L.upcomingEvents}
            </p>
            {events.length === 0 ? (
              <p className="hp-empty">{L.noEvents}</p>
            ) : (
              <ul className="hp-list">
                {events.slice(0, 4).map((event) => (
                  <li key={event.slug}>
                    <Link href={`/${locale}/events/${event.slug}`}>
                      <time
                        className="hp-date"
                        dateTime={new Date(event.startsAt).toISOString()}
                      >
                        {formatDate(event.startsAt, locale, { month: "short" })}
                        <b>
                          {formatDate(event.startsAt, locale, {
                            day: "numeric",
                          })}
                        </b>
                      </time>
                      <div className="hp-list-main">
                        <h3>{event.title}</h3>
                        {event.location && (
                          <div className="hp-loc">{event.location}</div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
