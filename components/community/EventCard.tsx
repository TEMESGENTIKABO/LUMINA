import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/homeLabels";

export function EventCard({
  event,
  locale,
}: {
  event: {
    slug: string;
    title: string;
    location: string;
    startsAt: Date | string;
  };
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/events/${event.slug}`}
      className="group block border border-obsidian-grey/10 p-6 transition-colors hover:border-manuscript-red/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manuscript-red"
    >
      <time
        dateTime={new Date(event.startsAt).toISOString()}
        className="section-label text-manuscript-red"
      >
        {formatDate(event.startsAt, locale)}
      </time>
      <h3 className="font-headline-en text-[length:var(--text-headline-md)] mt-2 group-hover:text-manuscript-red transition-colors">
        {event.title}
      </h3>
      {event.location && (
        <p className="font-ui text-sm text-obsidian-grey mt-2 flex items-center gap-1.5">
          <MapPin size={14} aria-hidden className="shrink-0" />
          {event.location}
        </p>
      )}
    </Link>
  );
}
