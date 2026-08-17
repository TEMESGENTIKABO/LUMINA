import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { canAccessAdmin } from "@/lib/admin/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) redirect("/en/sign-in?callbackUrl=/admin");
  if (!canAccessAdmin(session.user.role)) redirect("/en");

  return (
    <div className="flex min-h-screen bg-parchment-white text-aksum-black">
      <AdminSidebar role={session.user.role} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
