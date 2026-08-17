"use client";

import Link from "next/link";
import { X, Crown, ArrowRight } from "lucide-react";
import { useState } from "react";

interface MembershipCTAProps {
  locale: string;
  variant?: "banner" | "inline" | "sticky";
  title?: string;
  description?: string;
  onDismiss?: () => void;
}

export function MembershipCTA({
  locale,
  variant = "banner",
  title,
  description,
  onDismiss,
}: MembershipCTAProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (variant === "sticky") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-aksum-navy border-t border-aksum-gold/30 shadow-2xl">
        <div className="max-w-page mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-aksum-gold shrink-0" />
            <div>
              <p className="font-headline-en text-sm font-bold text-parchment-white">
                {title || "Support independent journalism"}
              </p>
              <p className="font-ui text-xs text-parchment-white/70 hidden sm:block">
                {description ||
                  "Get unlimited access to all Aksum reporting and analysis."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/membership`}
              className="px-4 py-2 bg-aksum-gold text-aksum-black font-ui text-xs font-bold uppercase tracking-wider hover:bg-parchment-white transition-colors"
            >
              Subscribe
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1 text-parchment-white/50 hover:text-parchment-white"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-obsidian-grey/[0.03] border border-hairline p-6 my-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Crown size={20} className="text-aksum-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-headline-en text-lg font-bold text-aksum-black mb-1">
                {title || "Read more with Aksum Pro"}
              </h3>
              <p className="font-ui text-sm text-obsidian-grey leading-relaxed max-w-lg">
                {description ||
                  "Unlock every article, get exclusive briefings, and support our newsroom."}
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-obsidian-grey/50 hover:text-aksum-black shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 pl-8">
          <Link
            href={`/${locale}/membership`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-aksum-black text-parchment-white font-ui text-sm font-semibold hover:bg-aksum-crimson transition-colors group"
          >
            View Plans
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    );
  }

  // Default banner
  return (
    <div className="relative bg-aksum-black text-parchment-white overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-aksum-gold via-transparent to-transparent" />
      <div className="max-w-page mx-auto px-6 py-10 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="text-aksum-gold" />
              <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-aksum-gold">
                Aksum Pro
              </span>
            </div>
            <h2 className="font-headline-en text-2xl md:text-3xl font-bold mb-2">
              {title || "Independent journalism deserves your support"}
            </h2>
            <p className="font-ui text-sm text-parchment-white/70 leading-relaxed">
              {description ||
                "Join thousands of readers who rely on Aksum for rigorous reporting across the Horn of Africa. Subscribe today and get full access."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/membership`}
              className="px-6 py-3 bg-aksum-gold text-aksum-black font-ui text-sm font-bold uppercase tracking-wider hover:bg-parchment-white transition-colors"
            >
              Subscribe Now
            </Link>
            <Link
              href={`/${locale}/membership`}
              className="px-6 py-3 border border-parchment-white/30 font-ui text-sm font-semibold hover:bg-parchment-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 text-parchment-white/40 hover:text-parchment-white"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
