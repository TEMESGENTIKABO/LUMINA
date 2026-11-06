import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const { articleId, title_en, dek_en, body_en } = await request.json();
  if (!articleId) return NextResponse.json({ error: "articleId required" }, { status: 400 });

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
  if (article.authorId !== session.user.id && !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Autosave updates content only - never touches status, category, or tags,
  // so a background save can never accidentally publish or recategorize.
  await prisma.article.update({
    where: { id: articleId },
    data: { title_en, dek_en, body_en },
  });

  return NextResponse.json({ savedAt: new Date().toISOString() });
}
