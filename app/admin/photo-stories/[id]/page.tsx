import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PhotoStoryForm } from "../PhotoStoryForm";
import { updatePhotoStory } from "@/lib/admin/actions/photoStoryActions";

export default async function EditPhotoStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, story] = await Promise.all([auth(), prisma.photoStory.findUnique({ where: { id } })]);
  if (!story) notFound();

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Edit Photo Story</h1>
      <PhotoStoryForm
        userRole={session?.user?.role ?? "AUTHOR"}
        initial={{
          slug: story.slug,
          title: story.title,
          intro: story.intro,
          published: story.published,
          images: story.images as { url: string; caption: string }[],
        }}
        onSubmit={async (formData) => {
          "use server";
          return updatePhotoStory(id, formData);
        }}
      />
    </div>
  );
}
