import { CheckoutForm } from "@/components/membership/CheckoutForm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const { tier } = await searchParams;

  return (
    <main className="max-w-content mx-auto px-6 pt-12 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)] mb-8">
        Checkout
      </h1>
      <CheckoutForm tierId={tier ?? "supporter"} />
    </main>
  );
}
