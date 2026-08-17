import { prisma } from "@/lib/prisma";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Media Library</h1>
      <div className="mb-8 max-w-lg">
        <MediaUploader />
      </div>
      <MediaGrid items={media} mode="browse" />
    </div>
  );
}
