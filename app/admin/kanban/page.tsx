import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageAllArticles } from "@/lib/admin/permissions";
import { KanbanBoard } from "./KanbanBoard";

export default async function KanbanPage() {
  const session = await auth();
  const canSeeAll = session?.user && canManageAllArticles(session.user.role);

  const articles = await prisma.article.findMany({
    where: canSeeAll ? { status: { not: "ARCHIVED" } } : { authorId: session?.user?.id, status: { not: "ARCHIVED" } },
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">Editorial Board</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">Drag articles between columns to change their status.</p>
      <KanbanBoard initialArticles={articles} />
    </div>
  );
}
