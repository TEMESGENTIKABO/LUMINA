import { prisma } from "@/lib/prisma";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { PageHeader, ui } from "@/components/admin/ui";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <PageHeader eyebrow="Library" title="Media">
        {media.length} image{media.length === 1 ? "" : "s"} · drag files in,
        browse, or paste from your clipboard.
      </PageHeader>
      <section className={`${ui.card} mb-6 p-5`}>
        <MediaUploader />
      </section>
      <MediaGrid items={media} mode="browse" />
    </div>
  );
}
