import { auth } from "@/auth";
import { PhotoStoryForm } from "../PhotoStoryForm";
import { createPhotoStory } from "@/lib/admin/actions/photoStoryActions";

export default async function NewPhotoStoryPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">New Photo Story</h1>
      <PhotoStoryForm
        userRole={session?.user?.role ?? "AUTHOR"}
        onSubmit={async (formData) => {
          "use server";
          return createPhotoStory(formData);
        }}
      />
    </div>
  );
}
