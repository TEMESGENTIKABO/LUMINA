"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertCircle, X, Loader2 } from "lucide-react";

export function ConfirmDeleteButton({
  onDelete,
  itemName,
  size = "sm",
}: {
  onDelete: () => Promise<{ success?: boolean; error?: string }>;
  itemName: string;
  size?: "sm" | "md";
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setError("");
      return;
    }
    startTransition(async () => {
      const result = await onDelete();
      if (result.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirming(false);
    setError("");
  }

  const sizeClasses =
    size === "md" ? "text-xs px-2.5 py-1.5" : "text-[11px] px-2 py-1";

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1">
        {confirming && !isPending && (
          <button
            onClick={handleCancel}
            className="font-ui text-[11px] text-[#8b8f99] hover:text-[#1a1c23] hover:bg-[#f5f4f2] rounded-lg px-1.5 py-1.5 transition-colors"
            title="Cancel"
          >
            <X size={13} />
          </button>
        )}
        <button
          onClick={handleClick}
          disabled={isPending}
          className={`
            inline-flex items-center gap-1.5 font-ui font-medium rounded-lg transition-all duration-150
            ${sizeClasses}
            ${
              confirming
                ? "bg-[#9b4a4a] text-white shadow-sm hover:bg-[#8a3f3f]"
                : "text-[#8b8f99] hover:text-[#9b4a4a] hover:bg-[#faf5f5]"
            }
            ${isPending ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
          <span>
            {isPending
              ? "Deleting..."
              : confirming
                ? `Delete ${itemName}`
                : "Delete"}
          </span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 font-ui text-[11px] text-[#9b4a4a] bg-[#fbeeee] px-2.5 py-1.5 rounded-lg max-w-[240px]">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span className="leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
