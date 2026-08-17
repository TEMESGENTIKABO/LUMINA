"use client";

import { useRef, useState, useTransition } from "react";
import { createCategory } from "@/lib/admin/actions/categoryActions";

const accentOptions = ["manuscript-red", "aksum-gold", "lalibela-blue", "terracotta", "obsidian-grey"];

interface ParentOption {
  id: string;
  name_en: string;
}

export function CategoryForm({ parentOptions }: { parentOptions: ParentOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input name="name_en" required placeholder="Name (English)" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="name_am" placeholder="Name (Amharic, optional)" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="slug" required placeholder="slug-in-lowercase" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <select name="accentColor" required className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
        {accentOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      <select name="parentId" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
        <option value="">No parent (top-level category)</option>
        {parentOptions.map((p) => (<option key={p.id} value={p.id}>{p.name_en}</option>))}
      </select>
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
        {isPending ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}
