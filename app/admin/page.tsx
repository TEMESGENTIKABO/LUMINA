import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  PenLine,
  CalendarClock,
  Users,
  Image as ImageIcon,
  Plus,
  UploadCloud,
  CalendarDays,
  Settings,
} from "lucide-react";
import { auth } from "@/auth";
import {
  getDashboardStats,
  getRecentActivity,
  getNeedsAttention,
} from "@/lib/admin/getDashboardStats";
import { getDashboardInsights } from "@/lib/admin/getDashboardInsights";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { NeedsAttention } from "@/components/admin/NeedsAttention";
import {
  Panel,
  ActivityChart,
  StatusBreakdown,
  TopCategories,
} from "@/components/admin/DashboardWidgets";

const TZ = "Africa/Addis_Ababa";
const SPLIT = "grid gap-5 mb-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]";

export default async function AdminDashboardPage() {
  const [session, stats, recent, attention, insights] = await Promise.all([
    auth(),
    getDashboardStats(),
    getRecentActivity(),
    getNeedsAttention(),
    getDashboardInsights(),
  ]);

  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: TZ,
    }).format(now),
  );
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = (session?.user?.name ?? "").split(" ")[0];
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  });
  const waiting = attention.inReview.length;
  const { thisWeek, lastWeek } = insights;
  const delta = thisWeek - lastWeek;

  const quick = [
    { href: "/admin/articles/new", label: "Write an article", icon: PenLine },
    { href: "/admin/media", label: "Upload media", icon: UploadCloud },
    {
      href: "/admin/calendar",
      label: "Editorial calendar",
      icon: CalendarDays,
    },
    ...(session?.user?.role === "ADMIN"
      ? [{ href: "/admin/settings", label: "Site settings", icon: Settings }]
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a6414]">
            {date}
          </p>
          <h1 className="font-headline-en text-3xl font-bold tracking-tight lg:text-4xl">
            {greeting}
            {first ? `, ${first}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-[#6b665c]">
            {waiting
              ? `${waiting} article${waiting === 1 ? " is" : "s are"} waiting for review.`
              : "You're all caught up. Nothing is waiting for review."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/media"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e6e1d6] bg-white px-4 text-sm font-semibold transition hover:-translate-y-px hover:border-[#cfc8b6]"
          >
            <UploadCloud size={16} /> Upload media
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-aksum-black px-4 text-sm font-semibold text-white transition hover:-translate-y-px hover:brightness-125"
          >
            <Plus size={16} className="text-[#c79a45]" /> New article
          </Link>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total articles"
          value={stats.totalArticles}
          icon={FileText}
          tone="indigo"
          trend={
            thisWeek + lastWeek > 0
              ? {
                  direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat",
                  value: `${thisWeek} new`,
                  label: `vs ${lastWeek} last week`,
                }
              : undefined
          }
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
          icon={PenLine}
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

      <div className={SPLIT}>
        <Panel title="New articles" aside="Last 14 days">
          <ActivityChart days={insights.days} />
        </Panel>
        <Panel title="Content status">
          <StatusBreakdown items={insights.byStatus} />
        </Panel>
      </div>

      <NeedsAttention
        inReview={attention.inReview}
        recentComments={attention.recentComments}
      />

      <div className={SPLIT}>
        <RecentActivity articles={recent} />
        <div className="flex min-w-0 flex-col gap-5">
          <Panel title="Top categories">
            <TopCategories items={insights.topCategories} />
          </Panel>
          <Panel title="Quick actions">
            <div className="grid grid-cols-2 gap-2.5 p-4">
              {quick.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center gap-3 rounded-xl border border-[#e6e1d6] p-3 text-[13.5px] font-semibold transition hover:-translate-y-px hover:border-[#c79a45] hover:bg-[#faf8f3]"
                >
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[#f1ede2] text-[#8a6414]">
                    <q.icon size={16} />
                  </span>
                  {q.label}
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
