"use client";

import "./home.css";
import "./home-upgrade.css";
import "./home-next.css";
import { useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { getHomeLabels } from "@/lib/homeLabels";

type Status = "idle" | "loading" | "done";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterBand({ locale = "en" }: { locale?: string }) {
  const L = getHomeLabels(locale);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const errorId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(L.invalidEmail);
      input.current?.focus();
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, topics: ["morning-brief"] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEmail("");
      setStatus("done");
    } catch {
      // A thrown fetch (offline, DNS, CORS) used to leave the button stuck on "...".
      setStatus("idle");
      setError(L.subscribeFailed);
    }
  }

  return (
    <div className="hp-w">
      <section className="hp-news" aria-labelledby={`${errorId}-t`}>
        <div className="hn-news-copy">
          <span className="hp-lab">Morning brief</span>
          <h2 id={`${errorId}-t`} className="hp-serif">
            {L.newsletterTitle}
          </h2>
          <p>The day&apos;s top stories, in your inbox each morning.</p>
        </div>

        <div className="hp-news-form">
          {status === "done" ? (
            <p className="hp-news-ok" role="status">
              <Check aria-hidden />
              {L.subscribed}
            </p>
          ) : (
            <>
              <form onSubmit={handleSubmit} noValidate>
                <input
                  ref={input}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={L.emailPlaceholder}
                  aria-label={L.emailLabel}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className="hp-input"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="hp-btn"
                >
                  {status === "loading" ? L.subscribing : L.subscribe}
                </button>
              </form>
              {error && (
                <p id={errorId} className="hp-news-err" role="alert">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
