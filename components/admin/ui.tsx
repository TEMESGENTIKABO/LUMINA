import type { ReactNode } from "react";

const field =
  "w-full rounded-[10px] border border-[#e6e1d6] bg-white px-3.5 text-sm text-[#12100d] placeholder:text-[#a8a293] transition hover:border-[#d4cdb9] focus:border-[#c79a45] focus:outline-none focus:ring-[3px] focus:ring-[#c79a45]/25";

export const ui = {
  input: `${field} h-10`,
  textarea: `${field} resize-y py-2.5 leading-relaxed`,
  label: "mb-1.5 block text-xs font-bold tracking-wide text-[#6b665c]",
  hint: "mt-1.5 text-xs text-[#6b665c]",
  card: "rounded-2xl border border-[#e6e1d6] bg-white shadow-[0_1px_2px_rgba(18,16,13,0.04)]",
  btn: "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6e1d6] bg-white px-4 text-sm font-semibold transition hover:-translate-y-px hover:border-[#cfc8b6] disabled:opacity-60 disabled:hover:translate-y-0",
  btnPrimary:
    "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-aksum-black px-4 text-sm font-semibold text-white transition hover:-translate-y-px hover:brightness-125 disabled:opacity-60 disabled:hover:translate-y-0 [&_svg]:text-[#c79a45]",
  iconBtn:
    "grid h-7 w-7 place-items-center rounded-lg bg-white/95 text-[#12100d] transition hover:bg-white",
};

export const tabsCls =
  "inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#ece7da] p-1";
export const tabCls = (on: boolean) =>
  `flex h-9 items-center gap-2 whitespace-nowrap rounded-[9px] px-3.5 text-[13.5px] font-semibold transition ${
    on
      ? "bg-white text-[#12100d] shadow-sm"
      : "text-[#6b665c] hover:text-[#12100d]"
  }`;

export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a6414]">
          {eyebrow}
        </p>
        <h1 className="font-headline-en text-3xl font-bold tracking-tight lg:text-4xl">
          {title}
        </h1>
        {children && (
          <p className="mt-1.5 text-sm text-[#6b665c]">{children}</p>
        )}
      </div>
      {actions}
    </header>
  );
}

export function Card({
  title,
  aside,
  children,
  className = "",
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${ui.card} ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-[#f0ece1] px-5 py-3.5">
        <h2 className="font-headline-en text-[15px] font-bold">{title}</h2>
        {aside}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
