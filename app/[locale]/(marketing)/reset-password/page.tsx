"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/actions/passwordResetActions";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await resetPassword(email, token, password);
    if (result.error) setError(result.error);
    else setDone(true);
  }

  if (!token || !email) {
    return (
      <main className="max-w-sm mx-auto px-6 pt-16 pb-20">
        <p className="font-ui text-sm text-manuscript-red">Invalid reset link.</p>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-16 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)]">Set a new password</h1>
      {done ? (
        <div className="mt-6">
          <p className="font-ui text-sm text-obsidian-grey">Your password has been reset.</p>
          <Button variant="primary" className="mt-4" onClick={() => router.push("/en/sign-in")}>Sign In</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 8 characters)"
            className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
          />
          {error && <p className="font-ui text-xs text-manuscript-red">{error}</p>}
          <Button type="submit" variant="primary">Reset Password</Button>
        </form>
      )}
    </main>
  );
}
