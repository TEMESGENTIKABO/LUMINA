import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArticleForm } from "../ArticleForm";
import { updateArticle } from "@/lib/admin/actions/articleActions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const topics = await prisma.topic.findMany({ orderBy: { title: "asc" } });
  const [article, categories, tags, authors] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: true, topics: true },
    }),
    prisma.category.findMany({ orderBy: { name_en: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: { in: ["AUTHOR", "EDITOR", "ADMIN"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!article) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Edit Article</h1>
        <Link
          href={`/admin/articles/${id}/history`}
          className="font-ui text-sm text-obsidian-grey hover:text-aksum-black"
        >
          View History
        </Link>
      </div>
      <ArticleForm
        categories={categories}
        tags={tags}
        topics={topics}
        authors={authors}
        userRole={session?.user?.role ?? "AUTHOR"}
        initial={{
          title_en: article.title_en,
          title_am: article.title_am,
          dek_en: article.dek_en,
          dek_am: article.dek_am,
          slug: article.slug,
          categoryId: article.categoryId,
          tagIds: article.tags.map((t) => t.tagId),
          topicIds: article.topics.map((t) => t.topicId),
          heroImageUrl: article.heroImageUrl,
          heroImageCaption: article.heroImageCaption,
          status: article.status,
          scheduledAt: article.scheduledAt,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          ogImageUrl: article.ogImageUrl,
          readTimeMinutes: article.readTimeMinutes,
          body_en: article.body_en as object,
          body_am: article.body_am as object | null,
          isBreaking: article.isBreaking, // Added isBreaking to initial object
        }}
        onSubmit={async (bodyJson, formData) => {
          "use server";
          return updateArticle(id, bodyJson, formData);
        }}
      />
    </div>
  );
}
