"use client";

export default function MarketingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-content mx-auto px-6 pt-20 pb-20 text-center">
      <p className="section-label text-manuscript-red mb-3">Something went wrong</p>
      <h1 className="font-headline-en text-2xl">We hit a snag loading this page.</h1>
      <p className="font-ui text-sm text-obsidian-grey mt-3">Our team has been notified. Please try again.</p>
      <button onClick={reset} className="mt-6 bg-aksum-black text-parchment-white font-ui text-sm px-5 py-2.5">
        Try again
      </button>
    </div>
  );
}
