import Link from "next/link";

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function EventCard({ event, locale }: { event: { slug: string; title: string; location: string; startsAt: Date | string }; locale: string }) {
  return (
    <Link href={`/${locale}/events/${event.slug}`} className="group block border border-obsidian-grey/10 p-6">
      <p className="section-label text-manuscript-red">{formatEventDate(event.startsAt)}</p>
      <h3 className="font-headline-en text-[length:var(--text-headline-md)] mt-2 group-hover:text-manuscript-red transition-colors">
        {event.title}
      </h3>
      <p className="font-ui text-sm text-obsidian-grey mt-2">{event.location}</p>
    </Link>
  );
}
