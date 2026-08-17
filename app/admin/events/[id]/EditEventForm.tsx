"use client";

import { useState, useTransition } from "react";

interface EventData {
  slug: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  startsAt: Date;
  published: boolean;
}

export function EditEventForm({
  event,
  onSubmit,
}: {
  event: EventData;
  onSubmit: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <input
        name="title"
        required
        defaultValue={event.title}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="slug"
        required
        defaultValue={event.slug}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <textarea
        name="description"
        required
        rows={3}
        defaultValue={event.description}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="location"
        required
        defaultValue={event.location}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="imageUrl"
        defaultValue={event.imageUrl ?? ""}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="startsAt"
        type="datetime-local"
        required
        defaultValue={new Date(event.startsAt).toISOString().slice(0, 16)}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <label className="flex items-center gap-2 font-ui text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={event.published}
        />
        Published
      </label>
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      {saved && <p className="font-ui text-xs text-lalibela-blue">Saved.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
