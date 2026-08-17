"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deletePhotoStory } from "@/lib/admin/actions/photoStoryActions";

export function PhotoStoryDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deletePhotoStory(id)} />;
}
