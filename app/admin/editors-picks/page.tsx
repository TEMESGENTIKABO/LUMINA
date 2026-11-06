import { prisma } from "@/lib/prisma";
import { EditorsPicksForm } from "./EditorsPicksForm";

export default async function EditorsPicksAdminPage() {
  const [articles, currentPicks] = await Promise.all([
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { id: true, title_en: true }, orderBy: { publishedAt: "desc" }, take: 50 }),
    prisma.editorsPick.findMany({ orderBy: { position: "asc" }, select: { articleId: true } }),
  ]);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">Editor's Picks</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">Choose up to 4 articles to feature on the homepage, in order.</p>
      <EditorsPicksForm articles={articles} currentIds={currentPicks.map((p) => p.articleId)} />
    </div>
  );
}
