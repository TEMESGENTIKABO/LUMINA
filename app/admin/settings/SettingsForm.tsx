"use client";

import { useState, useTransition } from "react";
import { updateSiteSettings } from "@/lib/admin/actions/settingsActions";
import { ThemePicker } from "./ThemePicker";
interface Settings {
  headerTheme: number;
  siteName: string;
  tagline_en: string;
  tagline_am: string | null;
  defaultSeoDescription: string | null;
  contactEmail: string | null;
  twitterUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <ThemePicker defaultValue={initial.headerTheme} />
      <div>
        <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
          Site Identity
        </label>
        <div className="flex flex-col gap-3">
          <input
            name="siteName"
            required
            defaultValue={initial.siteName}
            placeholder="Site name"
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          <input
            name="tagline_en"
            required
            defaultValue={initial.tagline_en}
            placeholder="Tagline (English)"
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          <input
            name="tagline_am"
            defaultValue={initial.tagline_am ?? ""}
            placeholder="Tagline (Amharic, optional)"
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
        </div>
      </div>

      <div>
        <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
          SEO
        </label>
        <textarea
          name="defaultSeoDescription"
          defaultValue={initial.defaultSeoDescription ?? ""}
          placeholder="Default meta description (used when an article has none set)"
          rows={2}
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
        />
      </div>

      <div>
        <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
          Contact
        </label>
        <input
          name="contactEmail"
          type="email"
          defaultValue={initial.contactEmail ?? ""}
          placeholder="contact@aksum.example.com"
          className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white w-full"
        />
      </div>

      <div>
        <label className="font-ui text-xs uppercase tracking-wide text-obsidian-grey block mb-2">
          Social Links
        </label>
        <div className="flex flex-col gap-3">
          <input
            name="twitterUrl"
            defaultValue={initial.twitterUrl ?? ""}
            placeholder="https://x.com/..."
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          <input
            name="facebookUrl"
            defaultValue={initial.facebookUrl ?? ""}
            placeholder="https://facebook.com/..."
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          <input
            name="instagramUrl"
            defaultValue={initial.instagramUrl ?? ""}
            placeholder="https://instagram.com/..."
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
          <input
            name="whatsappUrl"
            defaultValue={initial.whatsappUrl ?? ""}
            placeholder="https://wa.me/..."
            className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
          />
        </div>
      </div>

      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
      {saved && <p className="font-ui text-xs text-lalibela-blue">Saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
