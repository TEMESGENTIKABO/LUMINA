"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteEdition } from "@/lib/admin/actions/editionActions";

export function EditionDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deleteEdition(id)} />;
}
