import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditionForm } from "../EditionForm";
import { updateEdition } from "@/lib/admin/actions/editionActions";

export default async function EditEditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [edition, articles] = await Promise.all([
    prisma.digitalEdition.findUnique({ where: { id }, include: { articles: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { id: true, title_en: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  if (!edition) notFound();

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Edit Digital Edition</h1>
      <EditionForm
        articles={articles}
        initial={{
          slug: edition.slug, issueLabel: edition.issueLabel, coverImageUrl: edition.coverImageUrl,
          headline: edition.headline, published: edition.published,
          articleIds: edition.articles.map((a) => a.articleId),
        }}
        onSubmit={async (formData) => { "use server"; return updateEdition(id, formData); }}
      />
    </div>
  );
}
