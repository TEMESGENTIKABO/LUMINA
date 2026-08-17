"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreRevision } from "@/lib/admin/actions/articleActions";

export function RestoreRevisionButton({ articleId, revisionId }: { articleId: string; revisionId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const result = await restoreRevision(articleId, revisionId);
      if (result.error) {
        setError(result.error);
        setConfirming(false);
      } else {
        router.refresh();
        setConfirming(false);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`font-ui text-xs ${confirming ? "text-manuscript-red font-bold" : "text-obsidian-grey hover:text-aksum-black"}`}
      >
        {isPending ? "Restoring..." : confirming ? "Confirm restore?" : "Restore this version"}
      </button>
      {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
    </div>
  );
}
