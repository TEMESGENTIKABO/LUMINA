import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-ui font-semibold",
    "transition-colors duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-manuscript-red",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-aksum-gold text-aksum-black hover:opacity-90",
        secondary:
          "bg-aksum-black text-parchment-white hover:bg-manuscript-red",
        outline:
          "border border-aksum-black text-aksum-black hover:bg-aksum-black hover:text-parchment-white",
        ghost: "text-aksum-black hover:text-manuscript-red",
      },
      size: {
        sm: "min-h-9 px-3 text-sm",
        md: "min-h-11 px-5 text-sm", // 44px touch target
        lg: "min-h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Common = VariantProps<typeof button> & {
  className?: string;
  /** Shows a spinner and blocks clicks. Buttons only. */
  loading?: boolean;
};
type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };
type AsLink = Common &
  Omit<React.ComponentProps<typeof Link>, "className" | "href"> & {
    href: string;
  };

export type ButtonProps = AsButton | AsLink;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const {
      variant,
      size,
      className,
      children,
      href,
      loading: _l,
      ...rest
    } = props;
    return (
      <Link
        href={href}
        className={cn(button({ variant, size }), className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, loading, disabled, ...rest } =
    props;
  return (
    <button
      className={cn(button({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <Loader2
          size={16}
          aria-hidden
          className="animate-spin motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}
