"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [sent, setSent] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", { email, password, redirectTo: "/en/account" });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    await signIn("nodemailer", { email, redirect: false });
    setSent(true);
  }

  return (
    <main className="max-w-sm mx-auto px-6 pt-16 pb-20">
      <h1 className="font-headline-en text-[length:var(--text-headline-lg)]">
        Sign in to AKSUM
      </h1>

      <div className="flex flex-col gap-3 mt-8">
        <Button
          variant="outline"
          onClick={() => signIn("google", { redirectTo: "/en/account" })}
        >
          Continue with Google
        </Button>
      </div>

      <div className="flex gap-4 mt-8 border-b border-obsidian-grey/10">
        <button
          onClick={() => setMode("password")}
          className={`pb-2 font-ui text-sm ${mode === "password" ? "border-b-2 border-aksum-black" : "text-obsidian-grey"}`}
        >
          Password
        </button>
        <button
          onClick={() => setMode("magic-link")}
          className={`pb-2 font-ui text-sm ${mode === "magic-link" ? "border-b-2 border-aksum-black" : "text-obsidian-grey"}`}
        >
          Email link
        </button>
      </div>

      {mode === "password" ? (
        <>
          <form
            onSubmit={handleCredentials}
            className="flex flex-col gap-3 mt-6"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
            />
            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </form>
          <p className="font-ui text-sm text-obsidian-grey mt-4">
            <Link href="/en/forgot-password" className="text-aksum-black underline">
              Forgot your password?
            </Link>
          </p>
          <p className="font-ui text-sm text-obsidian-grey mt-4">
            No account?{" "}
            <Link href="/en/sign-up" className="text-aksum-black underline">
              Sign up
            </Link>
          </p>
        </>
      ) : sent ? (
        <>
          <p className="font-ui text-sm text-obsidian-grey mt-6">
            Check your email for your sign-in link.
          </p>
          <p className="font-ui text-sm text-obsidian-grey mt-6">
            No account?{" "}
            <Link href="/en/sign-up" className="text-aksum-black underline">
              Sign up
            </Link>
          </p>
        </>
      ) : (
        <>
          <form onSubmit={handleMagicLink} className="flex flex-col gap-3 mt-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border border-obsidian-grey/20 px-4 py-2 font-ui text-sm bg-parchment-white"
            />
            <Button type="submit" variant="primary">
              Send Link
            </Button>
          </form>
          <p className="font-ui text-sm text-obsidian-grey mt-6">
            No account?{" "}
            <Link href="/en/sign-up" className="text-aksum-black underline">
              Sign up
            </Link>
          </p>
        </>
      )}
    </main>
  );
}
