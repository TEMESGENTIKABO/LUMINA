"use client";

import "./article-modern.css";
import { useState, useSyncExternalStore } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandX,
} from "@tabler/icons-react";
import { SaveButton } from "./SaveButton";
import { ReadingModeToggle } from "./ReadingMode";
import { getLabels } from "@/lib/labels";

export function ShareBar({
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
  const L = getLabels(locale);
  const [copied, setCopied] = useState(false);
  const canShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && !!navigator.share,
    () => false,
  );

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${t}%20${u}`,
      Icon: IconBrandWhatsapp,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${u}&text=${t}`,
      Icon: IconBrandTelegram,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      Icon: IconBrandX,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: IconBrandFacebook,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {}
  }

  return (
    <div className="art-share" role="toolbar" aria-label={L.share}>
      {canShare && (
        <button
          type="button"
          className="art-sb"
          onClick={nativeShare}
          aria-label={L.share}
        >
          <Share2 size={19} />
        </button>
      )}
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="art-sb"
          aria-label={`${L.share}: ${label}`}
        >
          <Icon size={20} stroke={1.7} />
        </a>
      ))}
      <button
        type="button"
        className="art-sb"
        onClick={copy}
        aria-label={copied ? L.linkCopied : L.copyLink}
      >
        {copied ? <Check size={19} /> : <Link2 size={19} />}
      </button>
      <SaveButton
        articleSlug={articleSlug}
        locale={locale}
        className="art-sbs"
      />
      <ReadingModeToggle label={L.readingMode} />
    </div>
  );
}
