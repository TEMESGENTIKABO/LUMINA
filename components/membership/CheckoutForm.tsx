"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { membershipTiers } from "@/config/pricing";

export function CheckoutForm({ tierId }: { tierId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const tier =
    membershipTiers.find((t) => t.id === tierId) ?? membershipTiers[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to app/api/membership/checkout/route.ts + payment provider
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-body-en text-[length:var(--text-body)] text-obsidian-grey">
        Thanks — this is a placeholder checkout. Once a payment provider is
        wired up (see §8, Business Model), this will actually process the{" "}
        {tier.name} plan.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <p className="font-ui text-sm text-obsidian-grey">
        You selected: <span className="text-aksum-black">{tier.name}</span>
      </p>
      <input
        type="email"
        required
        placeholder="Email address"
        className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
      />
      <input
        type="text"
        required
        placeholder="Card number (placeholder)"
        className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
      />
      <Button type="submit" variant="primary">
        Confirm {tier.name} Membership
      </Button>
    </form>
  );
}
