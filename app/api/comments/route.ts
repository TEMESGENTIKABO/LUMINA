import { NextRequest, NextResponse } from "next/server";
import { getCommentsForArticle } from "@/content/cms/fetchers/getComments";

export async function GET(request: NextRequest) {
  const articleSlug = request.nextUrl.searchParams.get("articleSlug");
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  if (!articleSlug) return NextResponse.json({ error: "articleSlug required" }, { status: 400 });

  const result = await getCommentsForArticle(articleSlug, page);
  return NextResponse.json(result);
}
