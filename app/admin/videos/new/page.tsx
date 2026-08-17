import { auth } from "@/auth";
import { VideoForm } from "../VideoForm";
import { createVideo } from "@/lib/admin/actions/videoActions";

export default async function NewVideoPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">New Video</h1>
      <VideoForm
        userRole={session?.user?.role ?? "AUTHOR"}
        onSubmit={async (formData) => {
          "use server";
          return createVideo(formData);
        }}
      />
    </div>
  );
}
