"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

export function FollowButton({ topicSlug }: { topicSlug: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/followed-topics?slug=${topicSlug}`)
      .then((res) => res.json())
      .then((data) => setFollowing(data.following));
  }, [session, topicSlug]);

  async function toggle() {
    if (!session) {
      router.push(`/en/sign-in?callbackUrl=/en/topics/${topicSlug}`);
      return;
    }
    setLoading(true);
    const res = await fetch("/api/followed-topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicSlug }),
    });
    const data = await res.json();
    setFollowing(data.following);
    setLoading(false);
  }

  if (status === "loading") return null;

  return (
    <Button
      variant={following ? "outline" : "primary"}
      onClick={toggle}
      disabled={loading}
    >
      {following ? "Following" : "Follow Topic"}
    </Button>
  );
}
