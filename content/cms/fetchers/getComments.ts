import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 10;

export async function getCommentsForArticle(articleSlug: string, page = 0) {
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { articleSlug },
      orderBy: { createdAt: "desc" },
      include: { user: true },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.comment.count({ where: { articleSlug } }),
  ]);

  return { comments, total, hasMore: (page + 1) * PAGE_SIZE < total };
}
