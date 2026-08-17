import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";
import { ManageBillingButton } from "@/components/account/ManageBillingButton";
import { DataExportButton } from "@/components/account/DataExportButton";
export default async function AccountPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  });

  return (
    <div>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        My Account
      </h1>
      <p className="font-ui text-sm text-obsidian-grey mt-2">{user?.email}</p>
      <p className="font-ui text-sm text-obsidian-grey mt-1 capitalize">
        Membership: {user?.membershipTier}
      </p>
      {user?.membershipTier && user.membershipTier !== "reader" && (
        <div className="mt-4">
          <ManageBillingButton />
        </div>
      )}
      <div className="mt-6">
        <DataExportButton />
      </div>
      <DeleteAccountButton />
    </div>
  );
}
