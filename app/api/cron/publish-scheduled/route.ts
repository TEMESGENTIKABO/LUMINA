import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Protects this endpoint from being triggered by anyone who finds the URL.
// Set CRON_SECRET in .env; Vercel Cron sends this automatically once deployed
// via the Authorization header when configured in vercel.json.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const due = await prisma.article.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: now } },
    select: { id: true, slug: true },
  });

  if (due.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  await prisma.article.updateMany({
    where: { id: { in: due.map((a) => a.id) } },
    data: { status: "PUBLISHED", publishedAt: now },
  });

  revalidatePath("/en");
  revalidatePath("/am");
  for (const article of due) {
    revalidatePath(`/en/article/${article.slug}`);
    revalidatePath(`/am/article/${article.slug}`);
  }

  return NextResponse.json({ published: due.length, slugs: due.map((a) => a.slug) });
}
