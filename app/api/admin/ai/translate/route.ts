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

  const { title, dek, bodyParagraphs } = await request.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  try {
    const result = await geminiModel.generateContent(
      `Translate this Ethiopian news article from English to Amharic. This is a DRAFT translation for an editor to review and refine, not a final publish-ready translation - accuracy and natural Amharic phrasing matter more than speed. Respond ONLY with JSON in this exact shape: {"title_am": "...", "dek_am": "...", "body_am": ["paragraph one", "paragraph two", ...]}

Title: ${title}
Dek: ${dek ?? ""}
Body paragraphs:
${(bodyParagraphs ?? []).map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}`
    );

    const text = result.response.text();
    const parsed = extractJson<{ title_am: string; dek_am: string; body_am: string[] }>(text);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI translate failed:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
