"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

interface ArticleOption { id: string; title_en: string }
interface EditionData {
  slug: string; issueLabel: string; coverImageUrl: string; headline: string;
  published: boolean; articleIds: string[];
}

export function EditionForm({
  articles,
  initial,
  onSubmit,
}: {
  articles: ArticleOption[];
  initial?: EditionData;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
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
      <input name="issueLabel" required defaultValue={initial?.issueLabel} placeholder="Issue label (e.g. August 2026)" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="slug" required defaultValue={initial?.slug} placeholder="edition-slug" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="headline" required defaultValue={initial?.headline} placeholder="Headline" className="border border-obsidian-grey/20 px-3 py-2 font-headline-en text-lg bg-parchment-white" />

      <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
      {coverImageUrl && (
        <div className="relative aspect-[3/4] w-40 bg-obsidian-grey/10">
          <Image src={coverImageUrl} alt="" fill sizes="160px" className="object-cover" />
        </div>
      )}
      <button type="button" onClick={() => setPickerOpen(true)} className="font-ui text-xs text-obsidian-grey hover:text-aksum-black underline self-start">
        {coverImageUrl ? "Change cover" : "Select cover"}
      </button>

      <label className="flex items-center gap-2 font-ui text-sm">
        <input type="checkbox" name="published" defaultChecked={initial?.published} /> Published
      </label>

      <div>
        <p className="font-ui text-xs uppercase tracking-wide text-obsidian-grey mb-2">Articles in this edition</p>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto border border-obsidian-grey/10 p-3">
          {articles.map((a) => (
            <label key={a.id} className="flex items-center gap-2 font-ui text-sm">
              <input type="checkbox" name="articleIds" value={a.id} defaultChecked={initial?.articleIds.includes(a.id)} />
              {a.title_en}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
        {isPending ? "Saving..." : "Save Edition"}
      </button>

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setCoverImageUrl} />
    </form>
  );
}
