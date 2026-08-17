"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    // Replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full lg:w-auto gap-0">
      <div className="relative flex-1 lg:w-72">
        <Mail
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-white/40"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="w-full h-11 pl-10 pr-4 bg-parchment-white/10 border border-parchment-white/20 font-ui text-sm text-parchment-white placeholder:text-parchment-white/40 focus:outline-none focus:border-aksum-gold transition-colors disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="h-11 px-5 bg-aksum-gold text-aksum-black font-ui text-sm font-semibold hover:bg-parchment-white transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : status === "success" ? (
          <>
            <Check size={16} />
            <span className="hidden sm:inline">Subscribed</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Subscribe</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
