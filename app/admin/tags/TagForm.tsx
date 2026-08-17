"use client";

import { useRef, useState, useTransition } from "react";
import { createTag } from "@/lib/admin/actions/tagActions";

export function TagForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createTag(formData);
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input
        name="name"
        required
        placeholder="Tag name"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        name="slug"
        required
        placeholder="tag-slug"
        className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
      />
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Creating..." : "Create Tag"}
      </button>
    </form>
  );
}
