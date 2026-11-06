import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EventForm } from "./EventForm";
import { EventDeleteButton } from "./EventDeleteButton";
import { GenericBulkSelectTable } from "@/components/admin/GenericBulkSelectTable";
import { bulkDeleteEvents } from "@/lib/admin/actions/eventActions";
import Link from "next/link";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function EventsAdminPage() {
  const session = await auth();
  const events = await prisma.event.findMany({ orderBy: { startsAt: "asc" } });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Events</h1>

      <div className="mb-8 border border-obsidian-grey/10 p-6 max-w-lg">
        <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Event</h2>
        <EventForm userRole={session?.user?.role ?? "AUTHOR"} />
      </div>

      <GenericBulkSelectTable
        items={events}
        headers={["Title", "Location", "Starts", "Status", ""]}
        itemLabel="events"
        onBulkDelete={bulkDeleteEvents}
        rows={events.map((event) => (
          <>
            <td className="px-4 py-3 font-ui text-sm"><Link href={`/admin/events/${event.id}`} className="hover:text-manuscript-red">{event.title}</Link></td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{event.location}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{formatDate(event.startsAt)}</td>
            <td className="px-4 py-3 font-ui text-xs uppercase">{event.published ? <span className="text-manuscript-red">Published</span> : <span className="text-obsidian-grey">Draft</span>}</td>
            <td className="px-4 py-3 text-right"><EventDeleteButton id={event.id} name={event.title} /></td>
          </>
        ))}
      />
    </div>
  );
}
