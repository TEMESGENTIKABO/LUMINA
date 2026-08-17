import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const [user, savedArticles, followedTopics, comments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, bio: true, beat: true, membershipTier: true, createdAt: true },
    }),
    prisma.savedArticle.findMany({ where: { userId: session.user.id }, select: { articleSlug: true, createdAt: true } }),
    prisma.followedTopic.findMany({ where: { userId: session.user.id }, select: { topicSlug: true, createdAt: true } }),
    prisma.comment.findMany({ where: { userId: session.user.id }, select: { content: true, articleSlug: true, createdAt: true } }),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    account: user,
    savedArticles,
    followedTopics,
    comments,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="aksum-data-export.json"`,
    },
  });
}
