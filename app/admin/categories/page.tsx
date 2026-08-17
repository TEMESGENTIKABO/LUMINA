import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { CategoryForm } from "./CategoryForm";
import { CategoryDeleteButton } from "./CategoryDeleteButton";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name_en: "asc" },
    include: { _count: { select: { articles: true } }, parent: true },
  });

  const topLevel = categories.filter((c) => !c.parentId);

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Categories</h1>

      <div className="mb-8 border border-obsidian-grey/10 p-6 max-w-lg">
        <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Category</h2>
        <CategoryForm parentOptions={topLevel} />
      </div>

      <AdminTable headers={["Name (EN)", "Parent", "Slug", "Accent", "Articles", ""]}>
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td className="px-4 py-3 font-ui text-sm">
              <Link href={`/admin/categories/${cat.id}`} className="hover:text-manuscript-red">{cat.name_en}</Link>
            </td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{cat.parent?.name_en ?? "-"}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{cat.slug}</td>
            <td className="px-4 py-3">
              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: `var(--color-${cat.accentColor})` }} />
            </td>
            <td className="px-4 py-3 font-ui text-sm">{cat._count.articles}</td>
            <td className="px-4 py-3 text-right">
              <CategoryDeleteButton id={cat.id} name={cat.name_en} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
