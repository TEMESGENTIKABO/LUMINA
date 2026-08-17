"use client";

import { useState, useTransition } from "react";

const accentOptions = ["manuscript-red", "aksum-gold", "lalibela-blue", "terracotta", "obsidian-grey"];

interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_am: string | null;
  accentColor: string;
  parentId: string | null;
}
interface ParentOption {
  id: string;
  name_en: string;
}

export function CategoryEditForm({
  category,
  parentOptions,
  onSubmit,
}: {
  category: Category;
  parentOptions: ParentOption[];
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
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
      <input name="name_en" required defaultValue={category.name_en} placeholder="Name (English)" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="name_am" defaultValue={category.name_am ?? ""} placeholder="Name (Amharic, optional)" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <input name="slug" required defaultValue={category.slug} placeholder="slug-in-lowercase" className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white" />
      <select name="accentColor" required defaultValue={category.accentColor} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
        {accentOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
      </select>
      <select name="parentId" defaultValue={category.parentId ?? ""} className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white">
        <option value="">No parent (top-level category)</option>
        {parentOptions.map((p) => (<option key={p.id} value={p.id}>{p.name_en}</option>))}
      </select>
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      {saved && <p className="font-ui text-xs text-lalibela-blue">Saved.</p>}
      <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
