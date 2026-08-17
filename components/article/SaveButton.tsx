// SaveButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export function SaveButton({
  articleSlug,
  locale,
  className,
}: {
  articleSlug: string;
  locale: string;
  className?: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/saved-articles?slug=${articleSlug}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.saved));
  }, [session, articleSlug]);

  async function toggle() {
    if (!session) {
      router.push(
        `/${locale}/sign-in?callbackUrl=/${locale}/article/${articleSlug}`,
      );
      return;
    }
    setLoading(true);
    const res = await fetch("/api/saved-articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleSlug }),
    });
    const data = await res.json();
    setSaved(data.saved);
    setLoading(false);
  }

  if (status === "loading") return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Remove from saved" : "Save article"}
      className={clsx(
        "group flex items-center gap-2.5 px-4 py-2.5 border rounded transition-all",
        saved
          ? "border-aksum-gold bg-aksum-gold/5 text-aksum-gold"
          : "border-obsidian-grey/20 text-obsidian-grey hover:border-aksum-black hover:text-aksum-black",
        className,
      )}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Bookmark
          size={16}
          fill={saved ? "currentColor" : "none"}
          className="transition-transform group-hover:scale-110"
        />
      )}
      <span className="font-ui text-sm hidden sm:inline">
        {saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
