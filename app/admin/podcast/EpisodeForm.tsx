"use client";

import { useRef, useState, useTransition } from "react";
import { createEpisode } from "@/lib/admin/actions/podcastActions";

export function EpisodeForm({ shows }: { shows: { id: string; title: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createEpisode(formData);
      if (result.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <select
        name="showId"
        required
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      >
        <option value="">Select show</option>
        {shows.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </select>
      <input
        name="title"
        required
        placeholder="Episode title"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="slug"
        required
        placeholder="episode-slug"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <textarea
        name="description"
        required
        rows={2}
        placeholder="Description"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="audioUrl"
        placeholder="Spotify episode link, YouTube link, or direct .mp3 URL"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="durationSeconds"
        type="number"
        required
        placeholder="Duration (seconds)"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="episodeNumber"
        type="number"
        required
        placeholder="Episode number"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <label className="flex items-center gap-2 font-ui text-sm">
        <input type="checkbox" name="published" /> Published
      </label>
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Creating..." : "Create Episode"}
      </button>
    </form>
  );
}
