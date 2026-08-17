import { prisma } from "@/lib/prisma";
import { EditionForm } from "../EditionForm";
import { createEdition } from "@/lib/admin/actions/editionActions";

export default async function NewEditionPage() {
  const articles = await prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { id: true, title_en: true }, orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">New Digital Edition</h1>
      <EditionForm articles={articles} onSubmit={async (formData) => { "use server"; return createEdition(formData); }} />
    </div>
  );
}
