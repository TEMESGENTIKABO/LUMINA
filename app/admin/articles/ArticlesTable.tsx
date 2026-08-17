"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { ArticleDeleteButton } from "./ArticleDeleteButton";
import { BulkActionsBar } from "./BulkActionsBar";

const statusColors: Record<string, string> = {
  DRAFT: "text-obsidian-grey",
  IN_REVIEW: "text-lalibela-blue",
  SCHEDULED: "text-aksum-gold",
  PUBLISHED: "text-manuscript-red",
  ARCHIVED: "text-obsidian-grey",
};

interface ArticleRow {
  id: string;
  title_en: string;
  status: string;
  updatedAt: Date;
  category: { name_en: string };
  author: { name: string | null; email: string | null };
}

export function ArticlesTable({ articles }: { articles: ArticleRow[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function toggleAll() {
    setSelected(selected.length === articles.length ? [] : articles.map((a) => a.id));
  }

  return (
    <>
      <BulkActionsBar selectedIds={selected} onClear={() => setSelected([])} />
      <AdminTable headers={["", "Title", "Category", "Author", "Status", "Updated", ""]}>
        {articles.map((article) => (
          <tr key={article.id}>
            <td className="px-4 py-3">
              <input type="checkbox" checked={selected.includes(article.id)} onChange={() => toggle(article.id)} />
            </td>
            <td className="px-4 py-3 font-ui text-sm">
              <Link href={`/admin/articles/${article.id}`} className="hover:text-manuscript-red">{article.title_en}</Link>
            </td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{article.category.name_en}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{article.author.name ?? article.author.email}</td>
            <td className="px-4 py-3">
              <span className={`font-ui text-xs uppercase ${statusColors[article.status]}`}>{article.status}</span>
            </td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{new Date(article.updatedAt).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-3">
                <Link href={`/admin/articles/${article.id}`} className="font-ui text-xs text-obsidian-grey hover:text-aksum-black">Edit</Link>
                <ArticleDeleteButton id={article.id} name={article.title_en} />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
      <div className="mt-2">
        <button onClick={toggleAll} className="font-ui text-xs text-obsidian-grey hover:text-aksum-black">
          {selected.length === articles.length ? "Deselect all" : "Select all on this page"}
        </button>
      </div>
    </>
  );
}
