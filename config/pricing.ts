export interface PricingTier {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  priceETB: number;
  interval: "month" | "year";
  features: string[];
  highlighted?: boolean;
}

export const membershipTiers: PricingTier[] = [
  {
    id: "reader",
    name: "Reader",
    description: "Full access, ad-supported.",
    priceUSD: 0,
    priceETB: 0,
    interval: "month",
    features: ["5 free articles per month", "Daily newsletter", "Comment access"],
  },
  {
    id: "supporter",
    name: "Supporter",
    description: "Unlimited access, no ads.",
    priceUSD: 8,
    priceETB: 250,
    interval: "month",
    features: [
      "Unlimited articles",
      "Ad-free reading",
      "Monthly digital edition",
      "Early access to documentaries",
    ],
    highlighted: true,
  },
  {
    id: "patron",
    name: "Patron",
    description: "Support independent Ethiopian journalism directly.",
    priceUSD: 20,
    priceETB: 600,
    interval: "month",
    features: [
      "Everything in Supporter",
      "Patron-only events",
      "Name listed in annual supporter report",
    ],
  },
];

// Purchasing-power-adjusted display: diaspora sees USD, in-country sees ETB.
// Real implementation would detect region server-side; this is a manual toggle for now.
export function getDisplayPrice(tier: PricingTier, region: "diaspora" | "domestic"): string {
  return region === "domestic" ? `${tier.priceETB} ETB` : `$${tier.priceUSD}`;
}