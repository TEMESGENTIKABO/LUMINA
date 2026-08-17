import { getAllEvents } from "@/content/cms/fetchers/getEvents";
import { EventCard } from "@/components/community/EventCard";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const events = await getAllEvents();

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Events
      </h1>
      {events.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-8">
          No upcoming events.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} locale={locale} />
          ))}
        </div>
      )}
    </main>
  );
}
