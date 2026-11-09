import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;

  // Existing session / user lookup
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return (
    <AccountDashboard
      locale={locale}
      initialTab={tab}
      vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ""}
      user={{
        name: user?.name ?? null,
        email: user?.email ?? "",
        role: user?.role ?? "user",
        membership: user?.membershipTier ?? "reader", // "reader" | paid plan names
        createdAt: user?.createdAt?.toISOString() ?? null,
        emailVerified: !!user?.emailVerified,
        provider: null, // e.g. "google" — hides password form
        renewsAt: null, // paid plans: next billing date (ISO string)
        status: null, // paid plans: "active" | "past due" …
      }}
    />
  );
}
