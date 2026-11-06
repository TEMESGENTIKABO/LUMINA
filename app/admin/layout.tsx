import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { canAccessAdmin } from "@/lib/admin/permissions";
import { SessionProvider } from "next-auth/react";
import { CommandPaletteWrapper } from "@/components/admin/CommandPaletteWrapper";
import { AdminKeyboardShortcuts } from "@/components/admin/AdminKeyboardShortcuts";
import { getActiveTheme } from "@/lib/admin/actions/settingsActions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const split = Boolean(process.env.ADMIN_HOST);

  if (!session?.user) {
    redirect(
      split
        ? "/admin-login?callbackUrl=/admin"
        : "/en/sign-in?callbackUrl=/admin",
    );
  }
  if (!canAccessAdmin(session.user.role)) {
    redirect(split ? "/admin-login?error=forbidden" : "/en");
  }

  const theme = await getActiveTheme();

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-parchment-white text-aksum-black">
        <AdminSidebar role={session.user.role} />
        <div className="flex-1 min-w-0 flex flex-col">
          <AdminTopbar theme={theme} />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
        <CommandPaletteWrapper />
        <AdminKeyboardShortcuts />
      </div>
    </SessionProvider>
  );
}
