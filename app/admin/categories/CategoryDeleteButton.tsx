"use client";

import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteCategory } from "@/lib/admin/actions/categoryActions";

export function CategoryDeleteButton({ id, name }: { id: string; name: string }) {
  return <ConfirmDeleteButton itemName={name} onDelete={() => deleteCategory(id)} />;
}
