"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { revokeApiKey } from "@/lib/admin/actions/apiKeyActions";

export function ApiKeyDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => revokeApiKey(id)} />;
}
