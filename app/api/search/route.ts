import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/content/cms/fetchers/searchArticles";
import { generalLimiter, getClientIp } from "@/lib/rateLimit";
import { getCachedSearch, setCachedSearch } from "@/lib/searchCache";
import type { Article } from "@/content/types/Article";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const { success } = await generalLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get("q") ?? "";
  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const cached = await getCachedSearch<Article[]>(query);
  if (cached) {
    return NextResponse.json({ results: cached, cached: true });
  }

  const results = await searchArticles(query);
  await setCachedSearch(query, results);
  return NextResponse.json({ results, cached: false });
}
