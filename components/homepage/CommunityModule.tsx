import "./home.css";
import Link from "next/link";
import { SectionHead } from "./SectionHead";
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
  return (
    <section className="hp-sec">
      <div className="hp-w">
        <SectionHead kicker="Join in" title="Community" />
        <div className="hp-pair">
          <div className="hp-panel">
            <p className="hp-sub">Most Discussed</p>
            {discussed.length === 0 ? (
              <p
                className="hp-r"
                style={{ color: "var(--hp-mut)", fontSize: 14 }}
              >
                No discussion yet.
              </p>
            ) : (
              discussed.map(({ article, commentCount }) => (
                <Link
                  key={article.slug}
                  href={`/${locale}/article/${article.slug}`}
                  className="hp-r"
                >
                  <h3 style={{ flex: 1 }}>
                    {locale === "am" && article.title_am
                      ? article.title_am
                      : article.title_en}
                  </h3>
                  <span className="hp-cnt">{commentCount}</span>
                </Link>
              ))
            )}
          </div>

          <div className="hp-panel">
            <p className="hp-sub">Upcoming Events</p>
            {events.length === 0 ? (
              <p
                className="hp-r"
                style={{ color: "var(--hp-mut)", fontSize: 14 }}
              >
                No events scheduled yet.
              </p>
            ) : (
              events.slice(0, 4).map((event) => {
                const d = new Date(event.startsAt);
                return (
                  <Link
                    key={event.slug}
                    href={`/${locale}/events/${event.slug}`}
                    className="hp-r"
                  >
                    <span className="hp-date">
                      {d.toLocaleDateString("en-US", { month: "short" })}
                      <b>{d.getDate()}</b>
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <h3>{event.title}</h3>
                      {event.location && (
                        <div className="hp-loc">{event.location}</div>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
