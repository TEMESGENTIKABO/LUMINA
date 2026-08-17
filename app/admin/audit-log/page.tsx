import { prisma } from "@/lib/prisma";

const actionColors: Record<string, string> = {
  CREATED: "text-lalibela-blue",
  UPDATED: "text-obsidian-grey",
  DELETED: "text-manuscript-red",
  PUBLISHED: "text-aksum-gold",
  ROLE_CHANGED: "text-manuscript-red",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const PAGE_SIZE = 50;

  const [logs, total] = await Promise.all([
    prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { actor: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.adminAuditLog.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">Audit Log</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">{total} recorded actions</p>

      {logs.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">No actions recorded yet.</p>
      ) : (
        <div className="divide-y divide-hairline">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <span className={`font-ui text-xs uppercase font-bold ${actionColors[log.actionType]}`}>{log.actionType}</span>
                <span className="font-ui text-sm ml-2">{log.contentType}: {log.contentLabel}</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-ui text-xs text-obsidian-grey">{log.actor.name ?? log.actor.email}</p>
                <p className="font-ui text-xs text-obsidian-grey/60">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-4 mt-6">
          {page > 1 && <a href={`/admin/audit-log?page=${page - 1}`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">Previous</a>}
          <span className="font-ui text-xs text-obsidian-grey">Page {page} of {totalPages}</span>
          {page < totalPages && <a href={`/admin/audit-log?page=${page + 1}`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">Next</a>}
        </div>
      )}
    </div>
  );
}
