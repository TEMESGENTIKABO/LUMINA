"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { bulkUpdateStatus, bulkDeleteArticles } from "@/lib/admin/actions/articleActions";

export function BulkActionsBar({ selectedIds, onClear }: { selectedIds: string[]; onClear: () => void }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (selectedIds.length === 0) return null;

  function handleStatusChange(status: string) {
    setError("");
    startTransition(async () => {
      const result = await bulkUpdateStatus(selectedIds, status);
      if (result.error) setError(result.error);
      else {
        onClear();
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await bulkDeleteArticles(selectedIds);
      if (result.error) {
        setError(result.error);
        setConfirmingDelete(false);
      } else {
        onClear();
        setConfirmingDelete(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="sticky top-0 z-10 bg-aksum-black text-parchment-white px-4 py-3 flex items-center gap-4 mb-4">
      <span className="font-ui text-sm">{selectedIds.length} selected</span>
      <select
        onChange={(e) => e.target.value && handleStatusChange(e.target.value)}
        defaultValue=""
        disabled={isPending}
        className="font-ui text-sm bg-transparent border border-parchment-white/30 px-2 py-1"
      >
        <option value="" disabled>Set status to...</option>
        <option value="DRAFT">Draft</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className={`font-ui text-sm ${confirmingDelete ? "text-manuscript-red font-bold" : "hover:text-manuscript-red"}`}
      >
        {isPending ? "Working..." : confirmingDelete ? "Confirm delete?" : "Delete selected"}
      </button>
      <button onClick={onClear} className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white ml-auto">
        Clear selection
      </button>
      {error && <span className="font-ui text-xs text-aksum-gold">{error}</span>}
    </div>
  );
}
