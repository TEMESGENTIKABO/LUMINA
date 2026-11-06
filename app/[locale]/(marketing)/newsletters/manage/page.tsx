"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

const newsletterOptions = [
  { id: "morning-brief", label: "Morning Brief", description: "Daily, 6am - the day's top stories." },
  { id: "politics", label: "Politics Weekly", description: "Every Friday - analysis and opinion." },
  { id: "culture", label: "Culture Digest", description: "Biweekly - music, arts, and lifestyle." },
];

export default function ManagePreferencesPage() {
  const searchParams = useSearchParams();
  const emailFromLink = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromLink);
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/newsletter/preferences?email=${encodeURIComponent(email)}`);
    if (!res.ok) {
      setError("No subscription found for that email.");
      return;
    }
    const data = await res.json();
    setSelected(data.topics);
    setLoaded(true);
  }

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSave() {
    setSaved(false);
    await fetch("/api/newsletter/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, topics: selected }),
    });
    setSaved(true);
  }

  return (
    <main className="max-w-content mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">Manage Newsletter Preferences</h1>

      {!loaded ? (
        <form onSubmit={handleLookup} className="flex flex-col gap-3 mt-8 max-w-sm">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your subscribed email"
            className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
          />
          {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
          <Button type="submit" variant="primary">Find My Preferences</Button>
        </form>
      ) : (
        <div className="mt-8">
          <p className="font-ui text-sm text-obsidian-grey mb-4">{email}</p>
          <div className="flex flex-col gap-3 max-w-sm">
            {newsletterOptions.map((option) => (
              <label key={option.id} className="flex items-start gap-3 border border-obsidian-grey/10 p-4 cursor-pointer">
                <input type="checkbox" checked={selected.includes(option.id)} onChange={() => toggle(option.id)} className="mt-1" />
                <div>
                  <p className="font-ui text-sm text-aksum-black">{option.label}</p>
                  <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-1">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
          <Button variant="primary" className="mt-4" onClick={handleSave}>Save Preferences</Button>
          {saved && <p className="font-ui text-sm text-obsidian-grey mt-3">Preferences saved.</p>}
        </div>
      )}
    </main>
  );
}
