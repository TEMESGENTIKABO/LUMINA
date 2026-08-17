import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { ShowForm } from "./ShowForm";
import { EpisodeForm } from "./EpisodeForm";
import { ShowDeleteButton } from "./ShowDeleteButton";
import { EpisodeDeleteButton } from "./EpisodeDeleteButton";

export default async function PodcastAdminPage() {
  const shows = await prisma.podcastShow.findMany({
    orderBy: { title: "asc" },
    include: { episodes: { orderBy: { episodeNumber: "desc" } } },
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Podcasts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="border border-obsidian-grey/10 p-6">
          <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Show</h2>
          <ShowForm />
        </div>
        <div className="border border-obsidian-grey/10 p-6">
          <h2 className="font-ui text-sm uppercase tracking-wide text-obsidian-grey mb-4">New Episode</h2>
          <EpisodeForm shows={shows.map((s) => ({ id: s.id, title: s.title }))} />
        </div>
      </div>

      {shows.map((show) => (
        <div key={show.id} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline-en text-lg">{show.title}</h3>
            <ShowDeleteButton id={show.id} name={show.title} />
          </div>
          {show.episodes.length === 0 ? (
            <p className="font-ui text-sm text-obsidian-grey">No episodes yet.</p>
          ) : (
            <AdminTable headers={["Episode", "Title", "Status", ""]}>
              {show.episodes.map((ep) => (
                <tr key={ep.id}>
                  <td className="px-4 py-3 font-ui text-sm">#{ep.episodeNumber}</td>
                  <td className="px-4 py-3 font-ui text-sm">{ep.title}</td>
                  <td className="px-4 py-3 font-ui text-xs uppercase">{ep.published ? <span className="text-manuscript-red">Published</span> : <span className="text-obsidian-grey">Draft</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <EpisodeDeleteButton id={ep.id} name={ep.title} />
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      ))}
    </div>
  );
}
