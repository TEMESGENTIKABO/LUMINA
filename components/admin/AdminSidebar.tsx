import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Tags,
  Image as ImageIcon,
  Users,
  Settings,
  Calendar,
  Bookmark,
  Camera,
  MessageSquare,
  FileClock,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { Video as VideoIcon, Mic, Newspaper } from "lucide-react";
import { Key } from "lucide-react";
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: FileText,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Tags",
    href: "/admin/tags",
    icon: Tags,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Topics",
    href: "/admin/topics",
    icon: Bookmark,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Photo Stories",
    href: "/admin/photo-stories",
    icon: Camera,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  { label: "API Keys", href: "/admin/api-keys", icon: Key, roles: ["ADMIN"] },
  {
    label: "Events",
    href: "/admin/events",
    icon: Calendar,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Videos",
    href: "/admin/videos",
    icon: VideoIcon,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  {
    label: "Podcast",
    href: "/admin/podcast",
    icon: Mic,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  {
    label: "Editions",
    href: "/admin/editions",
    icon: Newspaper,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Comments",
    href: "/admin/comments",
    icon: MessageSquare,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: ImageIcon,
    roles: ["ADMIN", "EDITOR", "AUTHOR"],
  },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
  {
    label: "Audit Log",
    href: "/admin/audit-log",
    icon: FileClock,
    roles: ["ADMIN"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
];

export function AdminSidebar({ role }: { role: Role }) {
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-60 flex-shrink-0 bg-aksum-black text-parchment-white min-h-screen p-4">
      <Link
        href="/admin"
        className="font-headline-en text-lg font-bold block mb-8 px-2"
      >
        AKSUM Admin
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-ui text-parchment-white/70 hover:text-parchment-white hover:bg-parchment-white/10 transition-colors"
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
