import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { PhotoStoryDeleteButton } from "./PhotoStoryDeleteButton";

export default async function PhotoStoriesAdminPage() {
  const stories = await prisma.photoStory.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Photo Stories</h1>
        <Link href="/admin/photo-stories/new" className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2">
          New Photo Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">No photo stories yet.</p>
      ) : (
        <AdminTable headers={["Title", "Author", "Status", ""]}>
          {stories.map((story) => (
            <tr key={story.id}>
              <td className="px-4 py-3 font-ui text-sm">
                <Link href={`/admin/photo-stories/${story.id}`} className="hover:text-manuscript-red">{story.title}</Link>
              </td>
              <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{story.author.name ?? story.author.email}</td>
              <td className="px-4 py-3 font-ui text-xs uppercase">
                {story.published ? <span className="text-manuscript-red">Published</span> : <span className="text-obsidian-grey">Draft</span>}
              </td>
              <td className="px-4 py-3 text-right">
                <PhotoStoryDeleteButton id={story.id} name={story.title} />
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
