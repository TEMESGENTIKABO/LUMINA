"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteArticle } from "@/lib/admin/actions/articleActions";

export function ArticleDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deleteArticle(id)} />;
}
