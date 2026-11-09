"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const SIZES = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 } as const;

// Brand tokens only, with text colours that keep AA contrast.
const TONES = [
  { bg: "manuscript-red", fg: "parchment-white" },
  { bg: "lalibela-blue", fg: "parchment-white" },
  { bg: "obsidian-grey", fg: "parchment-white" },
  { bg: "aksum-gold", fg: "aksum-black" },
] as const;

function hash(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** First letter of the first and last word. Works for Latin and Ge'ez. */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : "";
  return (first + last).toLocaleUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES | number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const px = typeof size === "number" ? size : SIZES[size];
  const tone = TONES[hash(name) % TONES.length];
  const base = cn(
    "relative inline-flex shrink-0 overflow-hidden rounded-full",
    className,
  );

  if (src && !failed) {
    return (
      <span className={base} style={{ width: px, height: px }}>
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        base,
        "items-center justify-center font-ui font-semibold select-none",
      )}
      style={{
        width: px,
        height: px,
        fontSize: Math.round(px * 0.38),
        backgroundColor: `var(--color-${tone.bg})`,
        color: `var(--color-${tone.fg})`,
      }}
    >
      {initialsOf(name)}
    </span>
  );
}
