"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Plus, X } from "lucide-react";

interface ImageRow { url: string; caption: string }

export function PhotoStoryForm({
  initial,
  userRole,
  onSubmit,
}: {
  initial?: { slug: string; title: string; intro: string; published: boolean; images: ImageRow[] };
  userRole: string;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean } | void>;
}) {
  const [images, setImages] = useState<ImageRow[]>(initial?.images?.length ? initial.images : [{ url: "", caption: "" }]);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const canPublish = userRole === "ADMIN" || userRole === "EDITOR";

  function addRow() {
    setImages([...images, { url: "", caption: "" }]);
  }
  function removeRow(i: number) {
    setImages(images.filter((_, idx) => idx !== i));
  }
  function updateCaption(i: number, caption: string) {
    setImages(images.map((img, idx) => (idx === i ? { ...img, caption } : img)));
  }

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
      <input name="title" required defaultValue={initial?.title} placeholder="Story title" className="border border-obsidian-grey/20 px-3 py-2 font-headline-en text-lg bg-parchment-white" />
      <input name="slug" required defaultValue={initial?.slug} placeholder="photo-story-slug" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <textarea name="intro" required rows={3} defaultValue={initial?.intro} placeholder="Intro / description" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />

      {canPublish ? (
        <label className="flex items-center gap-2 font-ui text-sm">
          <input type="checkbox" name="published" defaultChecked={initial?.published} />
          Published
        </label>
      ) : (
        <p className="font-ui text-xs text-obsidian-grey">Saved as draft - an Editor or Admin must publish this.</p>
      )}

      <div>
        <p className="font-ui text-xs uppercase tracking-wide text-obsidian-grey mb-2">Images</p>
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <div key={i} className="flex gap-3 border border-obsidian-grey/10 p-3">
              <input type="hidden" name="imageUrl" value={img.url} />
              <button
                type="button"
                onClick={() => setPickerIndex(i)}
                className="relative w-24 aspect-[3/2] flex-shrink-0 bg-obsidian-grey/5 overflow-hidden"
              >
                {img.url ? (
                  <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-ui text-[10px] text-obsidian-grey">Select</span>
                )}
              </button>
              <input
                name="imageCaption"
                value={img.caption}
                onChange={(e) => updateCaption(i, e.target.value)}
                placeholder="Caption"
                className="flex-1 border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
              />
              <button type="button" onClick={() => removeRow(i)} className="text-obsidian-grey hover:text-manuscript-red flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow} className="flex items-center gap-1 font-ui text-xs text-obsidian-grey hover:text-aksum-black mt-2">
          <Plus size={14} /> Add image
        </button>
      </div>

      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
        {isPending ? "Saving..." : "Save Photo Story"}
      </button>

      {pickerIndex !== null && (
        <MediaPickerModal
          open={pickerIndex !== null}
          onClose={() => setPickerIndex(null)}
          onSelect={(url) => {
            setImages(images.map((img, idx) => (idx === pickerIndex ? { ...img, url } : img)));
            setPickerIndex(null);
          }}
        />
      )}
    </form>
  );
}
