"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteComment, bulkDeleteComments } from "@/lib/admin/actions/commentActions";

interface CommentRow {
  id: string;
  content: string;
  articleSlug: string;
  createdAt: Date;
  user: { name: string | null; email: string | null };
}

function formatDate(d: Date) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function CommentsModerationTable({ comments }: { comments: CommentRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmingBulk, setConfirmingBulk] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleSingleDelete(id: string) {
    startTransition(async () => {
      await deleteComment(id);
      router.refresh();
    });
  }

  function handleBulkDelete() {
    if (!confirmingBulk) {
      setConfirmingBulk(true);
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await bulkDeleteComments(selected);
      if (result.error) {
        setError(result.error);
      } else {
        setSelected([]);
        router.refresh();
      }
      setConfirmingBulk(false);
    });
  }

  if (comments.length === 0) {
    return <p className="font-ui text-sm text-obsidian-grey">No comments yet.</p>;
  }

  return (
    <div>
      {selected.length > 0 && (
        <div className="sticky top-0 z-10 bg-aksum-black text-parchment-white px-4 py-3 flex items-center gap-4 mb-4">
          <span className="font-ui text-sm">{selected.length} selected</span>
          <button
            onClick={handleBulkDelete}
            disabled={isPending}
            className={`font-ui text-sm ${confirmingBulk ? "text-manuscript-red font-bold" : "hover:text-manuscript-red"}`}
          >
            {isPending ? "Deleting..." : confirmingBulk ? "Confirm delete?" : "Delete selected"}
          </button>
          <button onClick={() => setSelected([])} className="font-ui text-sm text-parchment-white/60 hover:text-parchment-white ml-auto">
            Clear
          </button>
          {error && <span className="font-ui text-xs text-aksum-gold">{error}</span>}
        </div>
      )}

      <div className="divide-y divide-hairline">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 py-4">
            <input type="checkbox" checked={selected.includes(comment.id)} onChange={() => toggle(comment.id)} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-ui text-sm">
                  {comment.user.name ?? comment.user.email}{" "}
                  <span className="font-ui text-xs text-obsidian-grey/60">on</span>{" "}
                  <Link href={`/en/article/${comment.articleSlug}`} target="_blank" className="font-ui text-xs text-lalibela-blue hover:underline">
                    {comment.articleSlug}
                  </Link>
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-ui text-xs text-obsidian-grey">{formatDate(comment.createdAt)}</span>
                  <button onClick={() => handleSingleDelete(comment.id)} className="font-ui text-xs text-manuscript-red hover:underline">
                    Delete
                  </button>
                </div>
              </div>
              <p className="font-body-en text-sm mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
