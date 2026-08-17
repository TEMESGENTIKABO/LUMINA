import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const button = cva("inline-flex items-center justify-center font-ui text-sm transition-colors", {
  variants: {
    variant: {
      primary: "bg-aksum-gold text-aksum-black px-4 py-2 hover:opacity-90",
      ghost: "text-aksum-black hover:text-manuscript-red px-2 py-1",
      outline: "border border-aksum-black px-4 py-2 hover:bg-aksum-black hover:text-parchment-white",
    },
  },
  defaultVariants: { variant: "primary" },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(button({ variant }), className)} {...props} />;
}