import Link from "next/link";
import { Fragment } from "react";
import { prisma } from "@/lib/prisma";
import { GenericBulkSelectTable } from "@/components/admin/GenericBulkSelectTable";
import { bulkDeleteVideos } from "@/lib/admin/actions/videoActions";
import { VideoDeleteButton } from "./VideoDeleteButton";

export default async function VideosAdminPage() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Videos</h1>
        <Link
          href="/admin/videos/new"
          className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2"
        >
          New Video
        </Link>
      </div>
      {videos.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">No videos yet.</p>
      ) : (
        <GenericBulkSelectTable
          items={videos}
          headers={["Title", "Category", "Status", ""]}
          itemLabel="videos"
          onBulkDelete={bulkDeleteVideos}
          rows={videos.map((v) => (
            <Fragment key={v.id}>
              <td className="px-4 py-3 font-ui text-sm">
                <Link
                  href={`/admin/videos/${v.id}`}
                  className="hover:text-manuscript-red"
                >
                  {v.title_en}
                </Link>
              </td>
              <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">
                {v.category}
              </td>
              <td className="px-4 py-3 font-ui text-xs uppercase">
                {v.published ? (
                  <span className="text-manuscript-red">Published</span>
                ) : (
                  <span className="text-obsidian-grey">Draft</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <VideoDeleteButton id={v.id} name={v.title_en} />
              </td>
            </Fragment>
          ))}
        />
      )}
    </div>
  );
}
