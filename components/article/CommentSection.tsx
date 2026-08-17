"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createComment, deleteComment } from "@/lib/admin/actions/commentActions";

interface CommentItem {
  id: string;
  content: string;
  createdAt: Date | string;
  user: { name: string | null; email: string | null; id: string };
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function CommentSection({
  articleSlug,
  locale,
  initialComments,
  initialTotal,
  initialHasMore,
}: {
  articleSlug: string;
  locale: string;
  initialComments: CommentItem[];
  initialTotal: number;
  initialHasMore: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push(`/${locale}/sign-in?callbackUrl=/${locale}/article/${articleSlug}`);
      return;
    }
    setError("");
    const formData = new FormData();
    formData.set("articleSlug", articleSlug);
    formData.set("content", content);

    startTransition(async () => {
      const result = await createComment(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    });
  }

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetch(`/api/comments?articleSlug=${articleSlug}&page=${nextPage}`);
    const data = await res.json();
    setComments((prev) => [...prev, ...data.comments]);
    setPage(nextPage);
    setHasMore(data.hasMore);
    setLoadingMore(false);
  }

  return (
    <section className="max-w-content mx-auto px-6 mt-12">
      <button onClick={() => setOpen(!open)} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">
        {open ? "Hide discussion" : `Join the discussion (${initialTotal})`}
      </button>

      {open && (
        <div className="mt-4 border-t border-obsidian-grey/10 pt-4">
          {session ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                required
                maxLength={2000}
                className="border border-obsidian-grey/20 px-3 py-2 font-ui text-sm bg-parchment-white"
              />
              {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
              <button type="submit" disabled={isPending} className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 self-start">
                {isPending ? "Posting..." : "Post Comment"}
              </button>
            </form>
          ) : (
            <p className="font-ui text-sm text-obsidian-grey mb-6">
              <button onClick={() => router.push(`/${locale}/sign-in?callbackUrl=/${locale}/article/${articleSlug}`)} className="underline hover:text-aksum-black">
                Sign in
              </button>{" "}
              to join the discussion.
            </p>
          )}

          {comments.length === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No comments yet. Be the first.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {comments.map((comment) => {
                  const canDelete = session?.user?.id === comment.user.id || session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";
                  return (
                    <li key={comment.id} className="border-b border-obsidian-grey/10 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-ui text-sm text-aksum-black">{comment.user.name ?? comment.user.email}</p>
                        <div className="flex items-center gap-3">
                          <span className="font-ui text-xs text-obsidian-grey">{formatDate(comment.createdAt)}</span>
                          {canDelete && (
                            <button onClick={() => handleDelete(comment.id)} className="font-ui text-xs text-manuscript-red hover:underline">
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="font-body-en text-sm mt-1">{comment.content}</p>
                    </li>
                  );
                })}
              </ul>
              {hasMore && (
                <button onClick={loadMore} disabled={loadingMore} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black mt-4">
                  {loadingMore ? "Loading..." : "Load more comments"}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
