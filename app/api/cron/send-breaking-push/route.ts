import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

webpush.setVapidDetails(
  "mailto:hello@aksum.example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { articleSlug } = await request.json();
  const article = await prisma.article.findUnique({ where: { slug: articleSlug } });
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

  const subscriptions = await prisma.pushSubscription.findMany();
  const payload = JSON.stringify({
    title: "Breaking: " + article.title_en,
    body: article.dek_en,
    url: `${SITE_URL}/en/article/${article.slug}`,
  });

  let sent = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload);
      sent++;
    } catch (error) {
      // Expired/invalid subscriptions are expected over time - clean them up rather than logging noise every run.
      await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
    }
  }

  return NextResponse.json({ sent, total: subscriptions.length });
}
