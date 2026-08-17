"use client";

import { useRef, useState, useTransition } from "react";
import { createShow } from "@/lib/admin/actions/podcastActions";

export function ShowForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createShow(formData);
      if (result.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-3 max-w-lg"
    >
      <input
        name="title"
        required
        placeholder="Show title"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="slug"
        required
        placeholder="show-slug"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <textarea
        name="description"
        required
        rows={3}
        placeholder="Description"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="coverImageUrl"
        required
        placeholder="Cover image URL"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Creating..." : "Create Show"}
      </button>
    </form>
  );
}
