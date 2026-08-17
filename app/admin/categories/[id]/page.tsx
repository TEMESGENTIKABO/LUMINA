import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "@/lib/admin/actions/categoryActions";
import { CategoryEditForm } from "./CategoryEditForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { parentId: null, NOT: { id } }, orderBy: { name_en: "asc" } }),
  ]);

  if (!category) notFound();

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Edit Category</h1>
      <CategoryEditForm
        category={category}
        parentOptions={allCategories}
        onSubmit={async (formData) => {
          "use server";
          return updateCategory(id, formData);
        }}
      />
    </div>
  );
}
