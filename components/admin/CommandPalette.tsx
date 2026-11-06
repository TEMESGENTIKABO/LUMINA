"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, FileText, FolderTree, Tags, Bookmark, Camera, Calendar,
  Image as ImageIcon, Users, Settings, BarChart3, CalendarDays, MessageSquare,
  Key, FileClock, Plus, Search,
} from "lucide-react";

interface Results {
  articles: { id: string; title_en: string; status: string }[];
  users: { id: string; name: string | null; email: string | null }[];
  media: { id: string; filename: string }[];
}

const NAV_COMMANDS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "New Article", href: "/admin/articles/new", icon: Plus },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Tags", href: "/admin/tags", icon: Tags },
  { label: "Topics", href: "/admin/topics", icon: Bookmark },
  { label: "Photo Stories", href: "/admin/photo-stories", icon: Camera },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Editorial Calendar", href: "/admin/calendar", icon: CalendarDays },
  { label: "Comment Moderation", href: "/admin/comments", icon: MessageSquare },
  { label: "API Keys", href: "/admin/api-keys", icon: Key },
  { label: "Audit Log", href: "/admin/audit-log", icon: FileClock },
];

export function CommandPalette() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/admin/command-palette?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then(setResults);
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) setResults(null);
  }

  function go(href: string) {
    router.push(href);
    setOpen(false);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-aksum-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setOpen(false)}>
      <Command
        className="w-full max-w-xl bg-white rounded-2xl border border-[#e5e3df] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        shouldFilter={false}
      >
        <div className="flex items-center gap-3 px-5 border-b border-[#f0eeea]">
          <Search size={17} className="text-[#a5a39e]" />
          <Command.Input
            value={query}
            onValueChange={handleQueryChange}
            placeholder="Search or jump to..."
            autoFocus
            className="flex-1 font-ui text-[15px] py-4 bg-transparent outline-none placeholder:text-[#a5a39e]"
          />
          <kbd className="font-ui text-[10px] text-[#8b8f99] bg-[#f5f4f2] border border-[#e5e3df] rounded-md px-1.5 py-0.5">ESC</kbd>
        </div>

        <Command.List className="max-h-[26rem] overflow-y-auto p-2">
          <Command.Empty className="font-ui text-sm text-[#8b8f99] p-8 text-center">No results.</Command.Empty>

          {!query.trim() && (
            <Command.Group heading="Navigate" className="font-ui text-[10px] font-semibold uppercase tracking-wider text-[#a5a39e] px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {NAV_COMMANDS.map((cmd) => (
                <Command.Item
                  key={cmd.href}
                  onSelect={() => go(cmd.href)}
                  className="flex items-center gap-3 px-3 py-2.5 font-ui text-sm text-[#1a1c23] rounded-lg cursor-pointer data-[selected=true]:bg-[#faf6e8] transition-colors"
                >
                  <cmd.icon size={14} className="text-[#8b8f99]" />
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {results && results.articles.length > 0 && (
            <Command.Group heading="Articles" className="font-ui text-[10px] font-semibold uppercase tracking-wider text-[#a5a39e] px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 mt-2">
              {results.articles.map((a) => (
                <Command.Item
                  key={a.id}
                  onSelect={() => go(`/admin/articles/${a.id}`)}
                  className="flex items-center justify-between px-3 py-2.5 font-ui text-sm text-[#1a1c23] rounded-lg cursor-pointer data-[selected=true]:bg-[#faf6e8] transition-colors"
                >
                  <span className="truncate">{a.title_en}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#8b8f99] flex-shrink-0 ml-2">{a.status}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {results && results.users.length > 0 && (
            <Command.Group heading="Users" className="font-ui text-[10px] font-semibold uppercase tracking-wider text-[#a5a39e] px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 mt-2">
              {results.users.map((u) => (
                <Command.Item
                  key={u.id}
                  onSelect={() => go("/admin/users")}
                  className="px-3 py-2.5 font-ui text-sm text-[#1a1c23] rounded-lg cursor-pointer data-[selected=true]:bg-[#faf6e8] transition-colors"
                >
                  {u.name ?? u.email}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {results && results.media.length > 0 && (
            <Command.Group heading="Media" className="font-ui text-[10px] font-semibold uppercase tracking-wider text-[#a5a39e] px-2 py-1.5 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 mt-2">
              {results.media.map((m) => (
                <Command.Item
                  key={m.id}
                  onSelect={() => go("/admin/media")}
                  className="px-3 py-2.5 font-ui text-sm text-[#1a1c23] rounded-lg cursor-pointer data-[selected=true]:bg-[#faf6e8] transition-colors"
                >
                  {m.filename}
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
