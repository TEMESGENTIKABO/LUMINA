"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteVideo } from "@/lib/admin/actions/videoActions";

export function VideoDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deleteVideo(id)} />;
}
