import { notFound } from "next/navigation";
import Image from "next/image";
import { getEventBySlug } from "@/content/cms/fetchers/getEvents";

function formatEventDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const event = await getEventBySlug(eventSlug);
  if (!event) notFound();

  return (
    <main className="max-w-content mx-auto px-6 pt-12 pb-20">
      {event.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-grey/10">
          <Image src={event.imageUrl} alt={event.title} fill sizes="680px" className="object-cover" />
        </div>
      )}
      <p className="section-label text-manuscript-red mt-6">{formatEventDate(event.startsAt)}</p>
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)] mt-2">{event.title}</h1>
      <p className="font-ui text-sm text-obsidian-grey mt-2">{event.location}</p>
      <p className="font-body-en text-[length:var(--text-body)] mt-6">{event.description}</p>
    </main>
  );
}
