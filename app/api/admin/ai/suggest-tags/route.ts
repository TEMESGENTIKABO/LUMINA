import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

  const existingTags = await prisma.tag.findMany({ select: { name: true } });
  const existingNames = existingTags.map((t) => t.name);

  try {
    const result = await geminiModel.generateContent(
      `Suggest 3-5 relevant tags for this news article. Prefer reusing an existing tag from this list when genuinely relevant: ${existingNames.join(", ")}. You may also suggest new tags if none fit. Respond ONLY with a JSON array of strings, e.g. ["Tag One", "Tag Two"].

Title: ${title}
Dek: ${dek ?? ""}
Body excerpt: ${(bodyText ?? "").slice(0, 1500)}`
    );

    const text = result.response.text();
    const tags = extractJson<string[]>(text);
    return NextResponse.json({ tags, existingNames });
  } catch (error) {
    console.error("AI suggest-tags failed:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
