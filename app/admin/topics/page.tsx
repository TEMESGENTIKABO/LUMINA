import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { TopicForm } from "./TopicForm";
import { TopicDeleteButton } from "./TopicDeleteButton";

export default async function TopicsPage() {
  const session = await auth();
  const topics = await prisma.topic.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Topics</h1>

      <div className="mb-8 border border-obsidian-grey/10 p-6 max-w-lg">
        <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Topic</h2>
        <TopicForm userRole={session?.user?.role ?? "AUTHOR"} />
      </div>

      <AdminTable headers={["Title", "Slug", "Articles", "Status", ""]}>
        {topics.map((topic) => (
          <tr key={topic.id}>
            <td className="px-4 py-3 font-ui text-sm">{topic.title}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{topic.slug}</td>
            <td className="px-4 py-3 font-ui text-sm">{topic._count.articles}</td>
            <td className="px-4 py-3 font-ui text-xs uppercase">
              {topic.published ? <span className="text-manuscript-red">Published</span> : <span className="text-obsidian-grey">Draft</span>}
            </td>
            <td className="px-4 py-3 text-right">
              <TopicDeleteButton id={topic.id} name={topic.title} />
            </td>
          </tr>
        ))}
      </AdminTable>

      <p className="font-ui text-xs text-obsidian-grey mt-6">
        To link articles to a topic, use the Topics selector on each article's edit page.
      </p>
    </div>
  );
}
