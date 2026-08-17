"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteEpisode } from "@/lib/admin/actions/podcastActions";

export function EpisodeDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deleteEpisode(id)} />;
}
