import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "../ArticleForm";
import { createArticle } from "@/lib/admin/actions/articleActions";

export default async function NewArticlePage() {
  const session = await auth();
  const topics = await prisma.topic.findMany({ orderBy: { title: "asc" } });
  const [categories, tags, authors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name_en: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: { in: ["AUTHOR", "EDITOR", "ADMIN"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">New Article</h1>
      <ArticleForm
        categories={categories}
        tags={tags}
        topics={topics}
        authors={authors}
        userRole={session?.user?.role ?? "AUTHOR"}
        onSubmit={async (bodyJson, formData) => {
          "use server";
          return createArticle(bodyJson, formData);
        }}
      />
    </div>
  );
}
