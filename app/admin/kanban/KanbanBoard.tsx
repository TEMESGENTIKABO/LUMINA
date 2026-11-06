"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, DragOverlay, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { quickUpdateStatus } from "@/lib/admin/actions/articleActions";

interface KanbanArticle {
  id: string;
  title_en: string;
  status: string;
  author: { name: string | null; email: string | null };
  category: { name_en: string };
}

const COLUMNS = [
  { status: "DRAFT", label: "Draft", color: "border-obsidian-grey/30" },
  { status: "IN_REVIEW", label: "In Review", color: "border-lalibela-blue" },
  { status: "SCHEDULED", label: "Scheduled", color: "border-aksum-gold" },
  { status: "PUBLISHED", label: "Published", color: "border-manuscript-red" },
];

function KanbanCard({ article }: { article: KanbanArticle }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: article.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.4 : 1 } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-parchment-white border border-obsidian-grey/10 p-3 cursor-grab active:cursor-grabbing touch-none">
      <Link href={`/admin/articles/${article.id}`} onClick={(e) => e.stopPropagation()} className="font-ui text-sm hover:text-manuscript-red block truncate">
        {article.title_en}
      </Link>
      <p className="font-ui text-xs text-obsidian-grey/60 mt-1">{article.category.name_en} - {article.author.name ?? article.author.email}</p>
    </div>
  );
}

function KanbanColumn({ status, label, color, articles }: { status: string; label: string; color: string; articles: KanbanArticle[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[240px] border-t-2 ${color} bg-obsidian-grey/[0.02] ${isOver ? "bg-aksum-gold/10" : ""}`}>
      <div className="px-3 py-2 flex items-center justify-between">
        <p className="section-label">{label}</p>
        <span className="font-ui text-xs text-obsidian-grey/50 tabular-nums">{articles.length}</span>
      </div>
      <div className="flex flex-col gap-2 p-2 min-h-[300px]">
        {articles.map((a) => <KanbanCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}

export function KanbanBoard({ initialArticles }: { initialArticles: KanbanArticle[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [error, setError] = useState("");

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as string;
    const articleId = active.id as string;
    const current = articles.find((a) => a.id === articleId);
    if (!current || current.status === newStatus) return;

    // Optimistic update
    setArticles((prev) => prev.map((a) => (a.id === articleId ? { ...a, status: newStatus } : a)));

    const result = await quickUpdateStatus(articleId, newStatus);
    if (result.error) {
      setError(result.error);
      setArticles((prev) => prev.map((a) => (a.id === articleId ? { ...a, status: current.status } : a)));
      setTimeout(() => setError(""), 4000);
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      {error && <p className="font-ui text-sm text-manuscript-red mb-4">{error}</p>}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn key={col.status} {...col} articles={articles.filter((a) => a.status === col.status)} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
