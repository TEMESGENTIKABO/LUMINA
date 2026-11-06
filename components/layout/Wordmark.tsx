import Link from "next/link";

function Stele({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 56" className={className} aria-hidden="true">
      <path
        d="M7 55 L8.6 8 C8.8 3 11 1 14 1 C17 1 19.2 3 19.4 8 L21 55 Z"
        fill="#c79a45"
      />
      <g fill="#12100d">
        <rect x="11.5" y="12" width="5" height="3.2" rx="0.4" />
        <rect x="11.5" y="20" width="5" height="3.2" rx="0.4" />
        <rect x="11.5" y="28" width="5" height="3.2" rx="0.4" />
        <path d="M11 55 V45 C11 41.5 17 41.5 17 45 V55 Z" />
      </g>
    </svg>
  );
}

// Built for the dark header bar.
export function Wordmark({ locale }: { locale: string }) {
  return (
    <Link
      href={`/${locale}`}
      aria-label="Aksum home"
      className="flex flex-none items-center gap-2.5 text-white"
    >
      <Stele className="h-8 w-4" />
      <span className="font-headline-en text-[1.65rem] font-bold leading-none tracking-[-0.03em]">
        AKSUM
      </span>
      <span
        aria-hidden="true"
        className="hidden h-[22px] w-px bg-white/25 lg:block"
      />
      <span
        lang="am"
        className="hidden font-body-am text-[0.95rem] font-semibold text-aksum-gold lg:block"
      >
        አክሱም
      </span>
    </Link>
  );
}
