import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getForYouArticles } from "@/content/cms/fetchers/getForYouArticles";
import { getReadingHistory } from "@/content/cms/fetchers/getReadingHistory";

export async function GET() {
  const session = await auth();
  const headers = { "Cache-Control": "private, no-store" };

  if (!session?.user?.id) {
    return NextResponse.json(
      { signedIn: false, forYou: [], history: [] },
      { headers },
    );
  }

  const [forYou, history] = await Promise.all([
    getForYouArticles(session.user.id),
    getReadingHistory(session.user.id),
  ]);

  return NextResponse.json({ signedIn: true, forYou, history }, { headers });
}
