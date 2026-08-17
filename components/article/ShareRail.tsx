// ShareRail.tsx
"use client";

import { MessageCircle, X, Share2, Link2, Mail, Check } from "lucide-react";
import { SaveButton } from "./SaveButton";
import { useState } from "react";
import { clsx } from "clsx";

export function ShareRail({
  url,
  title,
  articleSlug,
  locale,
}: {
  url: string;
  title: string;
  articleSlug: string;
  locale: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: "WhatsApp",
    },
    {
      icon: X,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: "X",
    },
    {
      icon: Share2,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: "Facebook",
    },
    {
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      label: "Email",
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="hidden lg:flex flex-col gap-3 fixed left-6 top-1/3 -translate-y-1/2 z-30">
      <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm border border-obsidian-grey/10">
        {links.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${label}`}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-obsidian-grey hover:text-aksum-black hover:bg-obsidian-grey/5 transition-all"
          >
            <Icon size={18} />
          </a>
        ))}

        <button
          onClick={copyLink}
          aria-label="Copy link"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-obsidian-grey hover:text-aksum-black hover:bg-obsidian-grey/5 transition-all"
        >
          {copied ? (
            <Check size={18} className="text-aksum-gold" />
          ) : (
            <Link2 size={18} />
          )}
        </button>
      </div>

      <div className="flex justify-center">
        <SaveButton
          articleSlug={articleSlug}
          locale={locale}
          className="flex-col gap-1.5 px-3 py-2.5 border-obsidian-grey/20 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:bg-white"
        />
      </div>
    </div>
  );
}
