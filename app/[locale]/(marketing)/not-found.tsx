import Link from "next/link";

export default function MarketingNotFound() {
  return (
    <div className="max-w-content mx-auto px-6 pt-20 pb-20 text-center">
      <p className="section-label text-obsidian-grey/60 mb-3">404</p>
      <h1 className="font-headline-en text-2xl">Page not found</h1>
      <p className="font-ui text-sm text-obsidian-grey mt-3">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/en" className="mt-6 inline-block bg-aksum-black text-parchment-white font-ui text-sm px-5 py-2.5">
        Back to homepage
      </Link>
    </div>
  );
}
