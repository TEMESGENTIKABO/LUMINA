"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, topics: ["morning-brief"] }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <section className="hairline-y py-12 mt-8 bg-obsidian-grey/[0.02]">
      <div className="max-w-page mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-aksum-gold/10 flex-shrink-0">
            <Mail size={18} className="text-aksum-gold" />
          </div>
          <div>
            <p className="section-label text-aksum-gold mb-1">Newsletter</p>
            <h2 className="font-headline-en text-[length:var(--text-headline-md)]">
              The morning brief, every day.
            </h2>
          </div>
        </div>

        <div className="w-full sm:w-auto flex-shrink-0">
          {status === "success" ? (
            <p className="font-ui text-sm text-obsidian-grey flex items-center gap-2">
              <Check size={16} className="text-lalibela-blue" />
              You&apos;re subscribed.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="border border-hairline-strong px-4 py-2.5 font-ui text-sm flex-1 sm:w-72 bg-parchment-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aksum-gold focus-visible:border-aksum-gold placeholder:text-obsidian-grey/40"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </Button>
              </div>
              {status === "error" && (
                <p className="font-ui text-xs text-manuscript-red">
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
