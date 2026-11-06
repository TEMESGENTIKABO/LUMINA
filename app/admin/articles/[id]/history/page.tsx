import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RestoreRevisionButton } from "./RestoreRevisionButton";
import { RevisionDiff } from "./RevisionDiff";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function ArticleHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const revisions = await prisma.articleRevision.findMany({
    where: { articleId: id },
    orderBy: { createdAt: "desc" },
    include: { editedBy: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Revision History</h1>
        <Link href={`/admin/articles/${id}`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">
          Back to editor
        </Link>
      </div>
      <p className="font-ui text-sm text-obsidian-grey mb-2">{article.title_en}</p>

      <RevisionDiff revisions={revisions} />

      {revisions.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-6">No revisions recorded yet.</p>
      ) : (
        <div className="divide-y divide-hairline mt-6">
          {revisions.map((rev, i) => (
            <div key={rev.id} className="py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-ui text-sm">
                  {rev.title_en}{" "}
                  <span className="font-ui text-xs text-obsidian-grey/60 uppercase">({rev.status})</span>
                </p>
                <p className="font-ui text-xs text-obsidian-grey mt-1">
                  {rev.editedBy.name ?? rev.editedBy.email} - {formatDate(rev.createdAt)}
                </p>
              </div>
              {i !== 0 && <RestoreRevisionButton articleId={id} revisionId={rev.id} />}
              {i === 0 && <span className="font-ui text-xs text-obsidian-grey/50">Current</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
