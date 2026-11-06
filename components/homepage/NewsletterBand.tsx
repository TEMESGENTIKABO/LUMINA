"use client";

import "./home.css";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function NewsletterBand() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, topics: ["morning-brief"] }),
    });
    setLoading(false);
    if (!res.ok) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }
    showToast("You're subscribed. Welcome to AKSUM.", "success");
    setEmail("");
  }

  return (
    <div className="hp-w">
      <section className="hp-news">
        <div>
          <div className="hp-lab">Newsletter</div>
          <h2 className="hp-serif">The morning brief, every day.</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="hp-input"
          />
          <button type="submit" disabled={loading} className="hp-btn">
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </section>
    </div>
  );
}