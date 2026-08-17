import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEvent } from "@/lib/admin/actions/eventActions";
import { EditEventForm } from "./EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Edit Event</h1>
      <EditEventForm
        event={event}
        onSubmit={async (formData) => {
          "use server";
          return updateEvent(id, formData);
        }}
      />
    </div>
  );
}
