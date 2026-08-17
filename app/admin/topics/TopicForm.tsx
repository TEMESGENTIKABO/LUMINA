"use client";

import { useRef, useState, useTransition } from "react";
import { createTopic } from "@/lib/admin/actions/topicActions";

export function TopicForm({ userRole }: { userRole: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const canPublish = userRole === "ADMIN" || userRole === "EDITOR";

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createTopic(formData);
      if (result.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input name="title" required placeholder="Topic title" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="slug" required placeholder="topic-slug" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <textarea name="description" required rows={2} placeholder="Description" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      {canPublish ? (
        <label className="flex items-center gap-2 font-ui text-sm">
          <input type="checkbox" name="published" /> Published
        </label>
      ) : (
        <p className="font-ui text-xs text-obsidian-grey">Saved as draft - an Editor or Admin must publish this.</p>
      )}
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
        {isPending ? "Creating..." : "Create Topic"}
      </button>
    </form>
  );
}
