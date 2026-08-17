"use client";

import { useState, useTransition } from "react";
import { deleteOwnAccount } from "@/lib/actions/accountActions";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const result = await deleteOwnAccount();
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div className="mt-8 pt-8 border-t border-manuscript-red/20">
      <p className="font-ui text-xs uppercase tracking-wide text-manuscript-red mb-2">Danger Zone</p>
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`font-ui text-sm border px-4 py-2 ${confirming ? "bg-manuscript-red text-parchment-white border-manuscript-red" : "border-manuscript-red text-manuscript-red hover:bg-manuscript-red hover:text-parchment-white"}`}
      >
        {isPending ? "Deleting..." : confirming ? "Confirm permanent deletion" : "Delete my account"}
      </button>
      {error && <p className="font-ui text-xs text-manuscript-red mt-2">{error}</p>}
    </div>
  );
}
