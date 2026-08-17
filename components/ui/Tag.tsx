import { cn } from "@/lib/cn";

export function Tag({
  children,
  color = "obsidian-grey",
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 font-ui text-[length:var(--text-meta)] uppercase tracking-wide text-parchment-white",
        className
      )}
      style={{ backgroundColor: `var(--color-${color})` }}
    >
      {children}
    </span>
  );
}