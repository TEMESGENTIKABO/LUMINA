import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  PencilLine,
  CalendarClock,
  Users,
  Image as ImageIcon,
  Plus,
  CalendarDays,
} from "lucide-react";
import { auth } from "@/auth";
import {
  getDashboardStats,
  getRecentActivity,
  getNeedsAttention,
} from "@/lib/admin/getDashboardStats";
import { getAddisNow } from "@/lib/addisNow";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { NeedsAttention } from "@/components/admin/NeedsAttention";

export default async function AdminDashboardPage() {
  const [session, stats, recent, needsAttention] = await Promise.all([
    auth(),
    getDashboardStats(),
    getRecentActivity(),
    getNeedsAttention(),
  ]);

  const hour = getAddisNow().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = session?.user?.name?.split(" ")[0];

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#8a6414] mb-1.5">
            {greeting}
            {first ? `, ${first}` : ""}
          </p>
          <h1 className="font-headline-en text-3xl font-bold text-[#12100d] tracking-tight m-0">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 h-10 px-4 rounded-[11px] bg-aksum-black text-white text-[13.5px] font-semibold hover:bg-[#1a1e2b] transition-colors"
          >
            <Plus size={16} className="text-[#c9a227]" /> New article
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-2 h-10 px-4 rounded-[11px] bg-white border border-[#e6e1d6] text-[#12100d] text-[13.5px] font-semibold hover:border-[#cfc8b6] transition-colors"
          >
            <ImageIcon size={16} /> Media
          </Link>
          <Link
            href="/admin/calendar"
            className="flex items-center gap-2 h-10 px-4 rounded-[11px] bg-white border border-[#e6e1d6] text-[#12100d] text-[13.5px] font-semibold hover:border-[#cfc8b6] transition-colors"
          >
            <CalendarDays size={16} /> Calendar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          label="Total articles"
          value={stats.totalArticles}
          icon={FileText}
          tone="indigo"
        />
        <StatCard
          label="Published"
          value={stats.publishedArticles}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          label="Drafts"
          value={stats.draftArticles}
          icon={PencilLine}
          tone="slate"
        />
        <StatCard
          label="Scheduled"
          value={stats.scheduledArticles}
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Users"
          value={stats.totalUsers}
          icon={Users}
          tone="pink"
        />
        <StatCard
          label="Media files"
          value={stats.totalMedia}
          icon={ImageIcon}
          tone="cyan"
        />
      </div>

      <NeedsAttention
        inReview={needsAttention.inReview}
        recentComments={needsAttention.recentComments}
      />
      <RecentActivity articles={recent} />
    </div>
  );
}
