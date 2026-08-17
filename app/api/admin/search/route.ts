import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canAccessAdmin } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ articles: [], users: [], media: [] });

  const [articles, users, media] = await Promise.all([
    prisma.article.findMany({
      where: { title_en: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, title_en: true, status: true },
    }),
    session.user.role === "ADMIN"
      ? prisma.user.findMany({
          where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] },
          take: 5,
          select: { id: true, name: true, email: true },
        })
      : Promise.resolve([]),
    prisma.media.findMany({
      where: { filename: { contains: q, mode: "insensitive" } },
      take: 5,
      select: { id: true, filename: true, url: true },
    }),
  ]);

  return NextResponse.json({ articles, users, media });
}
