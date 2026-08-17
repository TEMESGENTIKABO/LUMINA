import { getDashboardStats, getRecentActivity } from "@/lib/admin/getDashboardStats";
import { StatCard } from "@/components/admin/StatCard";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { getNeedsAttention } from "@/lib/admin/getDashboardStats";
import { NeedsAttention } from "@/components/admin/NeedsAttention";
export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recent = await getRecentActivity();
const needsAttention = await getNeedsAttention();
  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Articles" value={stats.totalArticles} />
        <StatCard label="Published" value={stats.publishedArticles} />
        <StatCard label="Drafts" value={stats.draftArticles} />
        <StatCard label="Scheduled" value={stats.scheduledArticles} />
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Media Files" value={stats.totalMedia} />
      </div>
      <NeedsAttention
        inReview={needsAttention.inReview}
        recentComments={needsAttention.recentComments}
      />
      <RecentActivity articles={recent} />
    </div>
  );
}
