import { cn } from "@/lib/cn";

/** Loading placeholder. Decorative, so hidden from screen readers. */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse motion-reduce:animate-none rounded-sm bg-obsidian-grey/10",
        className,
      )}
      {...props}
    />
  );
}
