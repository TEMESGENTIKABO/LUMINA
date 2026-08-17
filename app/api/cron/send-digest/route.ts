import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { gte: oneDayAgo } },
    orderBy: { publishedAt: "desc" },
    take: 8,
    include: { category: true },
  });

  if (recentArticles.length === 0) {
    return NextResponse.json({ sent: 0, reason: "No new articles in the last 24 hours" });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { confirmed: true, topics: { has: "morning-brief" } },
  });

  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0, reason: "No subscribers to morning-brief" });
  }

  const articlesHtml = recentArticles
    .map(
      (a) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #8C2F2F; margin: 0 0 4px;">${a.category.name_en}</p>
        <a href="${SITE_URL}/en/article/${a.slug}" style="font-family: Georgia, serif; font-size: 18px; color: #12100D; text-decoration: none;">${a.title_en}</a>
        <p style="font-size: 14px; color: #666; margin: 4px 0 0;">${a.dek_en}</p>
      </td>
    </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px;">
      <h1 style="font-size: 20px; margin-bottom: 4px;">AKSUM Morning Brief</h1>
      <p style="color: #888; font-size: 13px; margin-bottom: 24px;">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      <table width="100%" cellpadding="0" cellspacing="0">${articlesHtml}</table>
      <p style="font-size: 11px; color: #aaa; margin-top: 32px;">You're receiving this because you subscribed to AKSUM's Morning Brief.</p>
    </div>`;

  let sentCount = 0;
  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: "AKSUM <onboarding@resend.dev>",
        to: sub.email,
        subject: `AKSUM Morning Brief - ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        html,
      });
      sentCount++;
    } catch (error) {
      console.error(`Digest send failed for ${sub.email}:`, error);
    }
  }

  return NextResponse.json({ sent: sentCount, total: subscribers.length, articleCount: recentArticles.length });
}
