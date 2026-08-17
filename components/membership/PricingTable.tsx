"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { membershipTiers, getDisplayPrice } from "@/config/pricing";

export function PricingTable({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [region, setRegion] = useState<"diaspora" | "domestic">("diaspora");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleChoose(tierId: string) {
    if (tierId === "reader") return;

    if (!session) {
      router.push(`/${locale}/sign-in?callbackUrl=/${locale}/membership`);
      return;
    }

    setError("");
    setLoadingTier(tierId);
    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
      setLoadingTier(null);
    }
  }

  return (
    <div>
      <div className="flex justify-center gap-2 mb-10">
        <button
          onClick={() => setRegion("diaspora")}
          className={cn("font-ui text-sm px-4 py-2 border", region === "diaspora" ? "bg-aksum-black text-parchment-white border-aksum-black" : "border-obsidian-grey/20 text-obsidian-grey")}
        >
          Diaspora (USD)
        </button>
        <button
          onClick={() => setRegion("domestic")}
          className={cn("font-ui text-sm px-4 py-2 border", region === "domestic" ? "bg-aksum-black text-parchment-white border-aksum-black" : "border-obsidian-grey/20 text-obsidian-grey")}
        >
          Ethiopia (ETB)
        </button>
      </div>

      {error && <p className="font-ui text-sm text-manuscript-red text-center mb-6">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {membershipTiers.map((tier) => (
          <div key={tier.id} className={cn("border p-8 flex flex-col", tier.highlighted ? "border-aksum-gold border-2" : "border-obsidian-grey/10")}>
            {tier.highlighted && <span className="font-ui text-xs uppercase tracking-wide text-aksum-gold mb-2">Most popular</span>}
            <h3 className="font-headline-en text-[length:var(--text-headline-md)]">{tier.name}</h3>
            <p className="font-ui text-sm text-obsidian-grey mt-2">{tier.description}</p>
            <p className="font-headline-en text-3xl mt-6">
              {getDisplayPrice(tier, region)}
              <span className="font-ui text-sm text-obsidian-grey"> / {tier.interval}</span>
            </p>
            <ul className="flex flex-col gap-2 mt-6 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 font-ui text-sm text-obsidian-grey">
                  <Check size={16} className="text-aksum-gold flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={tier.highlighted ? "primary" : "outline"}
              className="mt-8 w-full"
              disabled={loadingTier !== null}
              onClick={() => handleChoose(tier.id)}
            >
              {loadingTier === tier.id ? "Redirecting..." : tier.priceUSD === 0 ? "Continue Free" : `Choose ${tier.name}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
