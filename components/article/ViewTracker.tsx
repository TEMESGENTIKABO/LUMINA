"use client";

import { useEffect } from "react";

export function ViewTracker({ articleSlug }: { articleSlug: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleSlug }),
      keepalive: true,
    }).catch(() => {});
  }, [articleSlug]);

  return null;
}
