import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "../VideoForm";
import { updateVideo } from "@/lib/admin/actions/videoActions";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Edit Video</h1>
      <VideoForm initial={video} onSubmit={async (formData) => { "use server"; return updateVideo(id, formData); }} />
    </div>
  );
}
