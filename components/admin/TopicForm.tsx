"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { createTopic } from "@/lib/admin/actions/topicActions";

const field =
  "w-full rounded-xl border border-[#e5e3df] bg-white px-3.5 py-2.5 font-ui text-sm text-[#1a1c23] placeholder:text-[#a5a39e] hover:border-[#d4d2cd] focus:outline-none focus:border-[#c9a227]/60 focus:ring-4 focus:ring-[#c9a227]/10 transition-all";

export function TopicForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData): Promise<void> {
    setError("");

    // We explicitly type the result to match what createTopic returns
    startTransition(async () => {
      const result = await createTopic(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 bg-white rounded-2xl border border-[#e5e3df] p-5 shadow-[0_1px_2px_rgba(26,28,35,0.04)]"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-ui text-xs font-medium text-[#6b6f7a]">
          Title
        </span>
        <input
          name="title"
          required
          placeholder="Topic title"
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-ui text-xs font-medium text-[#6b6f7a]">Slug</span>
        <input
          name="slug"
          required
          placeholder="topic-slug"
          className={field}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-ui text-xs font-medium text-[#6b6f7a]">
          Description
        </span>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Describe this topic"
          className={`${field} resize-none`}
        />
      </label>
      <label className="flex items-center gap-2.5 font-ui text-sm text-[#1a1c23] cursor-pointer">
        <input
          type="checkbox"
          name="published"
          className="w-4 h-4 rounded border-[#d4d2cd] accent-[#c9a227]"
        />
        Published
      </label>
      {error && (
        <p className="flex items-center gap-1.5 font-ui text-xs text-[#9b4a4a] bg-[#fbeeee] px-3 py-2 rounded-lg">
          <AlertCircle size={13} /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 self-start rounded-xl bg-aksum-black text-parchment-white font-ui text-sm font-medium px-4 py-2.5 shadow-sm hover:bg-[#2a2c34] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Plus size={14} />
        )}
        {isPending ? "Creating…" : "Create Topic"}
      </button>
    </form>
  );
}
