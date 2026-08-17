import { PricingTable } from "@/components/membership/PricingTable";

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="max-w-page mx-auto px-6 pt-12 pb-20">
      <div className="text-center max-w-content mx-auto">
        <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
          Support independent Ethiopian journalism.
        </h1>
        <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-4">
          Membership keeps AKSUM&apos;s reporting free from advertiser influence —
          and funds the investigations that matter most.
        </p>
      </div>
      <div className="mt-12">
        <PricingTable locale={locale} />
      </div>
    </main>
  );
}
