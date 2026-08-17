import { prisma } from "@/lib/prisma";
import { CommentsModerationTable } from "./CommentsModerationTable";

const PAGE_SIZE = 30;

export default async function CommentsModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.comment.count(),
  ]);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">Comment Moderation</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">{total} total comments across the site</p>
      <CommentsModerationTable comments={comments} />
    </div>
  );
}
