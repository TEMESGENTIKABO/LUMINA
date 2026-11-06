import { prisma } from "@/lib/prisma";
import { MediaManager } from "@/components/admin/MediaManager";

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1440px] mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="font-headline-en text-3xl font-bold text-[#12100d] mb-1">
          Media Library
        </h1>
        <p className="font-ui text-sm text-[#6b665c]">
          Manage all images across your site.
        </p>
      </div>
      <MediaManager initialItems={media} />
    </div>
  );
}
