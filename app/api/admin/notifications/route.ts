import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canAccessAdmin } from "@/lib/admin/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const [inReviewCount, recentComments, newSubscribers] = await Promise.all([
    prisma.article.count({ where: { status: "IN_REVIEW" } }),
    prisma.comment.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);

  const items = [];
  if (inReviewCount > 0) items.push({ label: `${inReviewCount} article${inReviewCount !== 1 ? "s" : ""} awaiting review`, href: "/admin/articles?status=IN_REVIEW", type: "review" });
  if (recentComments > 0) items.push({ label: `${recentComments} new comment${recentComments !== 1 ? "s" : ""} in the last 24h`, href: "/admin/comments", type: "comment" });
  if (newSubscribers > 0) items.push({ label: `${newSubscribers} new newsletter subscriber${newSubscribers !== 1 ? "s" : ""}`, href: "/admin/settings", type: "info" });

  return NextResponse.json({ items, count: items.length });
}
