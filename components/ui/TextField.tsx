"use client";

import { forwardRef } from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { error, success, className, ...props },
  ref
) {
  return (
    <div>
      <input
        ref={ref}
        {...props}
        aria-invalid={Boolean(error)}
        className={`border px-4 py-2 font-ui text-sm bg-parchment-white w-full transition-colors ${
          error ? "border-manuscript-red" : success ? "border-manuscript-red/40" : "border-obsidian-grey/20 focus:border-aksum-black"
        } ${className ?? ""}`}
      />
      {error && <p className="font-ui text-xs text-manuscript-red mt-1">{error}</p>}
    </div>
  );
});
