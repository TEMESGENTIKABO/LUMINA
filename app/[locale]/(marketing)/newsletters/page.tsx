"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const newsletterOptions = [
  { id: "morning-brief", label: "Morning Brief", description: "Daily, 6am - the day's top stories." },
  { id: "politics", label: "Politics Weekly", description: "Every Friday - analysis and opinion." },
  { id: "culture", label: "Culture Digest", description: "Biweekly - music, arts, and lifestyle." },
];

export default function NewslettersPage() {
  const [selected, setSelected] = useState<string[]>(["morning-brief"]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, topics: selected }),
    });
    if (!res.ok) {
      setError("Something went wrong. Try again.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="max-w-content mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">Newsletters</h1>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3">
        Choose what lands in your inbox - nothing else.
      </p>

      {submitted ? (
        <p className="font-ui text-sm text-obsidian-grey mt-8">
          You're subscribed to {selected.length} newsletter{selected.length !== 1 ? "s" : ""}. Check your inbox for a welcome email.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {newsletterOptions.map((option) => (
            <label key={option.id} className="flex items-start gap-3 border border-obsidian-grey/10 p-4 cursor-pointer">
              <input type="checkbox" checked={selected.includes(option.id)} onChange={() => toggle(option.id)} className="mt-1" />
              <div>
                <p className="font-ui text-sm text-aksum-black">{option.label}</p>
                <p className="font-ui text-[length:var(--text-meta)] text-obsidian-grey mt-1">{option.description}</p>
              </div>
            </label>
          ))}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white mt-2"
          />
          {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
          <Button type="submit" variant="primary" className="self-start">Subscribe</Button>
        </form>
      )}
    </main>
  );
}
