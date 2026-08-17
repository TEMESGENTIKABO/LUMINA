"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

interface VideoData {
  slug: string; title_en: string; description_en: string; thumbnailUrl: string;
  videoUrl: string; durationSeconds: number; category: string; accentColor: string; published: boolean;
}

export function VideoForm({
  initial,
  userRole,
  onSubmit,
}: {
  initial?: VideoData;
  userRole: string;
  onSubmit: (
    formData: FormData,
  ) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnailUrl ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-3 max-w-lg">
      <input
        name="title_en"
        required
        defaultValue={initial?.title_en}
        placeholder="Title"
        className="border border-obsidian-grey/20 px-3 py-2 font-headline-en text-lg bg-parchment-white"
      />
      <input
        name="slug"
        required
        defaultValue={initial?.slug}
        placeholder="video-slug"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <textarea
        name="description_en"
        required
        rows={3}
        defaultValue={initial?.description_en}
        placeholder="Description"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />

      <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />
      {thumbnailUrl && (
        <div className="relative aspect-video bg-obsidian-grey/10">
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="font-ui text-xs text-obsidian-grey hover:text-aksum-black underline self-start"
      >
        {thumbnailUrl ? "Change thumbnail" : "Select thumbnail"}
      </button>

      <input
        name="videoUrl"
        defaultValue={initial?.videoUrl ?? ""}
        placeholder="YouTube, Vimeo, or direct .mp4 URL"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="durationSeconds"
        type="number"
        required
        defaultValue={initial?.durationSeconds}
        placeholder="Duration (seconds)"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="category"
        required
        defaultValue={initial?.category ?? "news"}
        placeholder="Category slug (e.g. news, culture)"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <select
        name="accentColor"
        defaultValue={initial?.accentColor ?? "manuscript-red"}
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      >
        {[
          "manuscript-red",
          "aksum-gold",
          "lalibela-blue",
          "terracotta",
          "obsidian-grey",
        ].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published}
        />{" "}
        Published
      </label>

      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Saving..." : "Save Video"}
      </button>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={setThumbnailUrl}
      />
    </form>
  );
}
