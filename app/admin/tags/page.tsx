import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { TagForm } from "./TagForm";
import { TagDeleteButton } from "./TagDeleteButton";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Tags</h1>

      <div className="mb-8 border border-obsidian-grey/10 p-6 max-w-lg">
        <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Tag</h2>
        <TagForm />
      </div>

      <AdminTable headers={["Name", "Slug", "Articles", ""]}>
        {tags.map((tag) => (
          <tr key={tag.id}>
            <td className="px-4 py-3 font-ui text-sm">{tag.name}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{tag.slug}</td>
            <td className="px-4 py-3 font-ui text-sm">{tag._count.articles}</td>
            <td className="px-4 py-3 text-right">
              <TagDeleteButton id={tag.id} name={tag.name} />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
