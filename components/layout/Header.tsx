import Link from "next/link";
import { UtilityBar } from "./UtilityBar";
import { ActivePrimaryNav } from "./ActivePrimaryNav";
import { ActiveSubcategoryBar } from "./ActiveSubcategoryBar";
import { HeaderSearchTrigger } from "./HeaderSearchTrigger";
import { MobileNav } from "./MobileNav";
import { getTranslations } from "next-intl/server";
import { primaryNav } from "@/config/navigation";

interface BreakingItem {
  title: string;
  href: string;
}

function BreakingTicker({ items }: { items: BreakingItem[] }) {
  const track = [...items, ...items];
  return (
    <div
      className="relative bg-aksum-black text-parchment-white overflow-hidden border-b border-neutral-800"
      aria-label="Breaking news"
    >
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
      <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center gap-3">
        <span className="shrink-0 rounded-sm bg-manuscript-red px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-parchment-white font-ui">
          Breaking
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track flex items-center gap-8 whitespace-nowrap">
            {track.map((item, i) => (
              <Link
                key={`${item.href}-${i}`}
                href={item.href}
                className="text-xs text-parchment-white/80 hover:text-parchment-white transition-colors font-ui font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  locale: string;
  breakingItems?: BreakingItem[];
}

export async function Header({ locale, breakingItems }: HeaderProps) {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-50 bg-parchment-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-1 focus:left-2 focus:z-[60] focus:bg-aksum-black focus:text-parchment-white focus:px-3 focus:py-1.5 focus:text-xs focus:font-ui focus:rounded-sm focus:ring-2 focus:ring-manuscript-red/50"
      >
        Skip to content
      </a>

      <UtilityBar locale={locale} />

      <div className="border-b border-hairline bg-parchment-white">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="lg:hidden flex items-center shrink-0">
            <MobileNav locale={locale} items={primaryNav} searchLabel={t("nav.search")} />
          </div>

          <div className="flex items-center shrink-0">
            <Link
              href={`/${locale}`}
              className="group flex items-baseline font-headline-en text-xl sm:text-2xl font-bold tracking-[-0.02em] text-aksum-black select-none"
            >
              <span className="text-manuscript-red transition-transform duration-200 group-hover:-translate-y-0.5 inline-block">A</span>
              <span>KSUM</span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center min-w-0">
            <ActivePrimaryNav locale={locale} />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hover:bg-aksum-black/[0.03] active:bg-aksum-black/[0.06] transition-colors duration-150 rounded-full p-2">
              <HeaderSearchTrigger locale={locale} label={t("nav.search")} />
            </div>
            <div className="lg:hidden">
              <HeaderSearchTrigger locale={locale} label={t("nav.search")} />
            </div>
          </div>
        </div>
      </div>

      {breakingItems && breakingItems.length > 0 && <BreakingTicker items={breakingItems} />}

      <ActiveSubcategoryBar locale={locale} />
    </header>
  );
}
