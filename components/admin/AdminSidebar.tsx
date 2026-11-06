"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  LayoutDashboard,
  BarChart3,
  FileText,
  SquareKanban,
  CalendarDays,
  Star,
  Camera,
  Video,
  Mic,
  BookOpen,
  Calendar,
  FolderTree,
  Tags,
  Bookmark,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Settings,
  Key,
  History,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@prisma/client";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}
interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL: Role[] = ["ADMIN", "EDITOR", "AUTHOR"];
const STAFF: Role[] = ["ADMIN", "EDITOR"];
const ADMIN: Role[] = ["ADMIN"];

const groups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        roles: STAFF,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "Articles",
        href: "/admin/articles",
        icon: FileText,
        roles: ALL,
      },
      {
        label: "Editorial Board",
        href: "/admin/kanban",
        icon: SquareKanban,
        roles: ALL,
      },
      {
        label: "Calendar",
        href: "/admin/calendar",
        icon: CalendarDays,
        roles: ALL,
      },
      {
        label: "Editor's Picks",
        href: "/admin/editors-picks",
        icon: Star,
        roles: STAFF,
      },
      {
        label: "Photo Stories",
        href: "/admin/photo-stories",
        icon: Camera,
        roles: ALL,
      },
      { label: "Videos", href: "/admin/videos", icon: Video, roles: ALL },
      { label: "Podcast", href: "/admin/podcast", icon: Mic, roles: ALL },
      {
        label: "Editions",
        href: "/admin/editions",
        icon: BookOpen,
        roles: STAFF,
      },
      { label: "Events", href: "/admin/events", icon: Calendar, roles: STAFF },
    ],
  },
  {
    title: "Organise",
    items: [
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
        roles: STAFF,
      },
      { label: "Tags", href: "/admin/tags", icon: Tags, roles: STAFF },
      { label: "Topics", href: "/admin/topics", icon: Bookmark, roles: STAFF },
      { label: "Media", href: "/admin/media", icon: ImageIcon, roles: ALL },
    ],
  },
  {
    title: "Community",
    items: [
      {
        label: "Comments",
        href: "/admin/comments",
        icon: MessageSquare,
        roles: STAFF,
      },
      { label: "Users", href: "/admin/users", icon: Users, roles: ADMIN },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ADMIN,
      },
      { label: "API Keys", href: "/admin/api-keys", icon: Key, roles: ADMIN },
      {
        label: "Audit Log",
        href: "/admin/audit-log",
        icon: History,
        roles: ADMIN,
      },
    ],
  },
];

function LocalEmblem() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-8 h-8 text-[#c9a227]"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2.6">
        <circle cx="32" cy="32" r="29" />
        <circle
          cx="32"
          cy="32"
          r="23.5"
          strokeWidth="1.3"
          strokeDasharray="2 3"
        />
      </g>
      <g fill="currentColor">
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d="M32 8 C38 15 38 23 32 30 C26 23 26 15 32 8Z"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
        {[45, 135, 225, 315].map((a) => (
          <path
            key={a}
            d="M32 17 C35 21 35 26 32 29 C29 26 29 21 32 17Z"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="3.6" />
      </g>
    </svg>
  );
}

export function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const visible = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.roles.includes(role)),
    }))
    .filter((g) => g.items.length > 0);

  const strip = (p: string) => p.replace(/^\/admin/, "") || "/";
  const here = strip(pathname);

  return (
    <aside className="w-[272px] flex-shrink-0 bg-aksum-black text-parchment-white min-h-screen flex flex-col border-r border-white/10 overflow-y-auto">
      <Link
        href="/admin"
        className="flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0"
      >
        <LocalEmblem />
        <div className="flex flex-col leading-tight">
          <span className="font-headline-en text-xl font-bold tracking-wider text-white">
            AKSUM
          </span>
          <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-[#c9a227] font-bold">
            Newsroom admin
          </span>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-5">
        {visible.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1 font-ui text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const h = strip(item.href);
                const active =
                  h === "/"
                    ? here === "/"
                    : here === h || here.startsWith(h + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg font-ui text-[13.5px] transition-colors duration-150 ${
                      active
                        ? "bg-white/10 text-white font-semibold"
                        : "text-white/70 hover:text-white hover:bg-white/5 font-medium"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r bg-[#c9a227]" />
                    )}
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-[#c9a227]"
                          : "text-white/60 group-hover:text-white"
                      }
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 mt-auto flex-shrink-0">
        <a
          href="/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/20 text-white text-[13px] font-semibold hover:bg-white/5 transition-colors"
        >
          View live site <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  );
}
