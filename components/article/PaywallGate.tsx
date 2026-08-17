import Link from "next/link";

export function PaywallGate({ locale }: { locale: string }) {
  return (
    <div className="max-w-content mx-auto px-6 mt-8 border border-hairline-strong p-8 text-center bg-aksum-gold/[0.04]">
      <p className="section-label text-aksum-gold mb-2">Members Only</p>
      <h3 className="font-headline-en text-[length:var(--text-headline-md)]">
        You've reached your free article limit for this month.
      </h3>
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey mt-3">
        Subscribe to AKSUM for unlimited access to independent Ethiopian journalism.
      </p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <Link href={`/${locale}/membership`} className="bg-aksum-black text-parchment-white font-ui text-sm px-5 py-2.5">
          See membership plans
        </Link>
        <Link href={`/${locale}/sign-in`} className="font-ui text-sm text-obsidian-grey hover:text-aksum-black">
          Already a member? Sign in
        </Link>
      </div>
    </div>
  );
}
