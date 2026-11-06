"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Emblem } from "@/components/layout/header/Emblem";

export function AdminLoginForm({
  callbackUrl,
  forbidden,
}: {
  callbackUrl: string;
  forbidden: boolean;
}) {
  const [mode, setMode] = useState<"password" | "link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    window.location.href = callbackUrl;
  }

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("nodemailer", {
      email,
      redirect: false,
      redirectTo: callbackUrl,
    });
    setLoading(false);
    if (result?.error) setError("Could not send the sign-in link.");
    else setSent(true);
  }

  return (
    <main className="ad-login">
      <section className="ad-lbrand">
        <div className="logo ad-serif">
          <Emblem /> AKSUM
        </div>
        <div>
          <div className="big ad-serif">The newsroom, in one place.</div>
          <p>
            Write, review and publish stories for readers across Ethiopia and
            the world.
          </p>
        </div>
        <small
          style={{ opacity: 0.55, letterSpacing: ".2em", fontWeight: 700 }}
        >
          TRUTH · INSIGHT · IMPACT
        </small>
      </section>

      <section className="ad-lform">
        <div className="ad-lcard">
          <div className="lab">AKSUM Admin</div>
          <h1 className="ad-serif">Staff sign-in</h1>

          {forbidden && (
            <div className="ad-lwarn">
              This account does not have admin access.
              <br />
              <button onClick={() => signOut({ redirectTo: "/admin-login" })}>
                Sign out and use a different account
              </button>
            </div>
          )}

          <div className="ad-ltabs" role="group" aria-label="Sign-in method">
            <button
              type="button"
              aria-pressed={mode === "password"}
              onClick={() => setMode("password")}
            >
              Password
            </button>
            <button
              type="button"
              aria-pressed={mode === "link"}
              onClick={() => setMode("link")}
            >
              Email link
            </button>
          </div>

          {mode === "password" ? (
            <form onSubmit={handlePassword}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              {error && <p className="ad-lerr">{error}</p>}
              <button type="submit" disabled={loading} className="go">
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : sent ? (
            <p style={{ color: "var(--ad-mut)", fontSize: 14 }}>
              Check your email for the sign-in link.
            </p>
          ) : (
            <form onSubmit={handleLink}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
              {error && <p className="ad-lerr">{error}</p>}
              <button type="submit" disabled={loading} className="go">
                {loading ? "Sending…" : "Send link"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
