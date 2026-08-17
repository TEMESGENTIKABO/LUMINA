import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { canAccessAdmin } from "@/lib/admin/permissions";
import { geminiModel, extractJson } from "@/lib/ai/geminiClient";
import { generalLimiter } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { success } = await generalLimiter.limit(session.user.id);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { title, dek, bodyText } = await request.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  try {
    const result = await geminiModel.generateContent(
      `You are an SEO editor for AKSUM, a premium bilingual Ethiopian media platform. Given this article, write an SEO title (under 60 characters) and meta description (under 155 characters). Respond ONLY with JSON: {"seoTitle": "...", "seoDescription": "..."}

Article title: ${title}
Dek: ${dek ?? ""}
Body excerpt: ${(bodyText ?? "").slice(0, 1500)}`
    );

    const text = result.response.text();
    const parsed = extractJson<{ seoTitle: string; seoDescription: string }>(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI suggest-seo failed:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
