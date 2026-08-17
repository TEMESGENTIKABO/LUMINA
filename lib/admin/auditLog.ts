import { prisma } from "@/lib/prisma";

type AuditActionType = "CREATED" | "UPDATED" | "DELETED" | "PUBLISHED" | "ROLE_CHANGED";

export async function logAdminAction({
  actorId,
  actionType,
  contentType,
  contentId,
  contentLabel,
  snapshot,
}: {
  actorId: string;
  actionType: AuditActionType;
  contentType: string;
  contentId: string;
  contentLabel: string;
  snapshot?: object;
}) {
  try {
    await prisma.adminAuditLog.create({
      data: { actorId, actionType, contentType, contentId, contentLabel, snapshot: snapshot as any },
    });
  } catch (error) {
    // Audit logging must never break the actual operation it's logging.
    console.error("Audit log write failed:", error);
  }
}
