"use client";

import "./account.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Bell, Bookmark, Crown, Database, Heart, History, LayoutDashboard, LogOut,
  ShieldCheck, SlidersHorizontal, User,
} from "lucide-react";
import { ToastProvider } from "./ui";
import { initialsOf, type AccountUser, type TabId } from "./shared";
import {
  Following, Membership, Notifications, Overview, Preferences, Privacy, Profile,
  ReadingHistory, Saved, Security, type TabDef,
} from "./sections";

const TABS: TabDef[] = [
  { id: "overview", label: "Overview", desc: "Your account at a glance", icon: LayoutDashboard, group: "Account" },
  { id: "saved", label: "Saved", desc: "Stories to read later", icon: Bookmark, group: "Your content" },
  { id: "following", label: "Following", desc: "Topics you care about", icon: Heart, group: "Your content" },
  { id: "history", label: "History", desc: "What you've read", icon: History, group: "Your content" },
  { id: "profile", label: "Profile", desc: "Name, bio and email", icon: User, group: "Account" },
  { id: "membership", label: "Membership", desc: "Plan and billing", icon: Crown, group: "Account" },
  { id: "security", label: "Security", desc: "Password and devices", icon: ShieldCheck, group: "Account" },
  { id: "notifications", label: "Notifications", desc: "Push and email alerts", icon: Bell, group: "Settings" },
  { id: "preferences", label: "Preferences", desc: "Theme, text size, language", icon: SlidersHorizontal, group: "Settings" },
  { id: "privacy", label: "Privacy & data", desc: "Export or delete your data", icon: Database, group: "Settings" },
];
const GROUPS = ["Your content", "Account", "Settings"] as const;
const isTab = (v: unknown): v is TabId => TABS.some((t) => t.id === v);

export function AccountDashboard({
  user, locale, vapidPublicKey, initialTab,
}: { user: AccountUser; locale: string; vapidPublicKey: string; initialTab?: string }) {
  const [tab, setTab] = useState<TabId>(isTab(initialTab) ? initialTab : "overview");
  const [prevInitial, setPrevInitial] = useState(initialTab);
  const chipRef = useRef<HTMLButtonElement>(null);

  // A link such as /account?tab=saved (from the header menu) should switch tabs.
  if (initialTab !== prevInitial) {
    setPrevInitial(initialTab);
    setTab(isTab(initialTab) ? initialTab : "overview");
  }

  const go = useCallback((t: TabId) => {
    setTab(t);
    const u = new URL(window.location.href);
    u.searchParams.set("tab", t);
    window.history.pushState(null, "", u);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, []);

  // Browser back/forward moves between tabs.
  useEffect(() => {
    const onPop = () => {
      const t = new URLSearchParams(window.location.search).get("tab");
      setTab(isTab(t) ? t : "overview");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Keep the active mobile chip in view.
  useEffect(() => {
    chipRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [tab]);

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <ToastProvider>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:pt-10">
        <h1 className="mb-6 font-serif text-3xl font-semibold text-aksum-black sm:text-4xl lg:mb-8">My Account</h1>

        {/* Mobile: swipeable tabs pinned under the header */}
        <nav aria-label="Account sections" className="sticky top-[60px] z-30 -mx-4 mb-6 border-b border-obsidian-grey/15 bg-parchment-white/90 backdrop-blur lg:hidden">
          <div className="acct-chips flex snap-x gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <button key={t.id} ref={active ? chipRef : undefined} type="button" onClick={() => go(t.id)} aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 flex-none snap-start items-center gap-2 rounded-full px-4 font-ui text-[13px] font-semibold transition duration-200 active:scale-95 ${
                    active ? "bg-aksum-black text-parchment-white" : "border border-obsidian-grey/25 text-obsidian-grey"}`}>
                  <t.icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center gap-3 rounded-2xl border border-obsidian-grey/15 p-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-aksum-black font-ui text-sm font-bold text-parchment-white">{initialsOf(user.name, user.email)}</span>
                <div className="min-w-0">
                  <p className="truncate font-ui text-sm font-semibold text-aksum-black">{user.name || "Your account"}</p>
                  <p className="truncate font-ui text-xs text-obsidian-grey/70">{user.email}</p>
                </div>
              </div>
              <nav aria-label="Account sections" className="space-y-5">
                {GROUPS.map((g) => (
                  <div key={g}>
                    <p className="mb-1.5 px-3 font-ui text-[11px] font-bold uppercase tracking-[.14em] text-obsidian-grey/60">{g}</p>
                    {TABS.filter((t) => t.group === g).map((t) => {
                      const active = t.id === tab;
                      return (
                        <button key={t.id} type="button" onClick={() => go(t.id)} aria-current={active ? "page" : undefined}
                          className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left font-ui text-sm font-semibold transition duration-200 ${
                            active ? "bg-aksum-black text-parchment-white" : "text-obsidian-grey hover:bg-obsidian-grey/10 hover:text-aksum-black"}`}>
                          <t.icon size={18} /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
              <button type="button" onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 font-ui text-sm font-semibold text-manuscript-red transition hover:bg-manuscript-red/10">
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </aside>

          <main id="account-main" aria-label={current.label} className="min-w-0">
            <div key={tab} className="acct-in">
              {tab === "overview" && <Overview user={user} locale={locale} tabs={TABS} go={go} />}
              {tab === "profile" && <Profile user={user} />}
              {tab === "saved" && <Saved locale={locale} />}
              {tab === "following" && <Following locale={locale} />}
              {tab === "history" && <ReadingHistory locale={locale} />}
              {tab === "notifications" && <Notifications vapidPublicKey={vapidPublicKey} />}
              {tab === "membership" && <Membership user={user} locale={locale} />}
              {tab === "security" && <Security user={user} locale={locale} />}
              {tab === "preferences" && <Preferences locale={locale} />}
              {tab === "privacy" && <Privacy user={user} />}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
