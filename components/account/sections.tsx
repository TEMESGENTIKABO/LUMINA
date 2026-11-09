"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight, BadgeCheck, Bookmark, Check, Clock, Crown, Eye, EyeOff, Heart, History,
  LogOut, Monitor, Moon, Search, ShieldCheck, Sun, Trash2,
} from "lucide-react";
import { headerNav } from "@/config/headerNav";
import { DATA_SAVER_KEY } from "@/lib/dataSaverScript";
import { ManageBillingButton } from "@/components/account/ManageBillingButton";
import { PushOptIn } from "@/components/account/PushOptIn";
import { DataExportButton } from "@/components/account/DataExportButton";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";
import { TEXT_SIZE_KEY, TEXT_SIZES, applyTextSize, type TextSize } from "./TextSizeInit";
import {
  Btn, Card, Empty, Field, LocalNote, SectionHead, Skeleton, Switch, btnCls, inputCls, useToast,
} from "./ui";
import {
  LOCAL_PREFIX, api, fmtDate, initialsOf, isMissing, isPaid, useList, useSynced,
  type AccountUser, type TabId,
} from "./shared";

export interface TabDef {
  id: TabId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  group: "Your content" | "Account" | "Settings";
}

/* =============================== OVERVIEW =============================== */
export function Overview({
  user, locale, tabs, go,
}: { user: AccountUser; locale: string; tabs: TabDef[]; go: (t: TabId) => void }) {
  const paid = isPaid(user.membership);
  const [push, setPush] = useState<string>("na");
  useEffect(() => {
    const f = requestAnimationFrame(() =>
      setPush(typeof Notification === "undefined" ? "na" : Notification.permission),
    );
    return () => cancelAnimationFrame(f);
  }, []);

  const checklist = [
    { done: !!user.name?.trim(), label: "Add your name", tab: "profile" as TabId },
    { done: user.emailVerified !== false, label: "Verify your email", tab: "profile" as TabId },
    { done: push === "granted", label: "Turn on breaking-news alerts", tab: "notifications" as TabId },
    { done: paid, label: "Become a member", tab: "membership" as TabId },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="acct-stagger space-y-6">
      <Card className="relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid h-20 w-20 flex-none place-items-center rounded-full bg-aksum-black font-ui text-2xl font-bold text-parchment-white">
            {initialsOf(user.name, user.email)}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-2xl font-semibold text-aksum-black sm:text-3xl">
              {user.name?.trim() || "Welcome back"}
            </h2>
            <p className="truncate font-ui text-sm text-obsidian-grey/80">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-ui text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-aksum-black px-3 py-1 font-semibold capitalize text-parchment-white">
                {paid && <Crown size={12} />} {user.membership}
              </span>
              {user.createdAt && (
                <span className="rounded-full border border-obsidian-grey/20 px-3 py-1 text-obsidian-grey/80">
                  Member since {fmtDate(user.createdAt, locale)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-ui text-sm font-semibold text-aksum-black">Finish setting up</h3>
          <span className="font-ui text-xs text-obsidian-grey/70">{doneCount} of {checklist.length}</span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-obsidian-grey/15" role="progressbar" aria-valuenow={doneCount} aria-valuemax={checklist.length}>
          <div className="h-full rounded-full bg-aksum-black transition-[width] duration-700" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
        </div>
        <ul className="divide-y divide-obsidian-grey/10">
          {checklist.map((c) => (
            <li key={c.label}>
              <button type="button" onClick={() => go(c.tab)} disabled={c.done}
                className="flex min-h-12 w-full items-center gap-3 py-2 text-left font-ui text-sm disabled:cursor-default">
                <span className={`grid h-6 w-6 flex-none place-items-center rounded-full border ${c.done ? "border-aksum-black bg-aksum-black text-parchment-white" : "border-obsidian-grey/30"}`}>
                  {c.done && <Check size={14} />}
                </span>
                <span className={c.done ? "text-obsidian-grey/60 line-through" : "text-aksum-black"}>{c.label}</span>
                {!c.done && <ArrowRight size={15} className="ml-auto text-obsidian-grey/60" />}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tabs.filter((t) => t.id !== "overview").map((t) => (
          <button key={t.id} type="button" onClick={() => go(t.id)}
            className="group flex items-start gap-4 rounded-2xl border border-obsidian-grey/15 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-aksum-black">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-obsidian-grey/10 text-aksum-black transition group-hover:bg-aksum-black group-hover:text-parchment-white">
              <t.icon size={20} />
            </span>
            <span className="min-w-0">
              <span className="block font-ui text-sm font-semibold text-aksum-black">{t.label}</span>
              <span className="mt-0.5 block font-ui text-xs text-obsidian-grey/70">{t.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================ PROFILE ================================ */
export function Profile({ user }: { user: AccountUser }) {
  const toast = useToast();
  const { update } = useSession();
  const { value, save, loading, local } = useSynced("profile", "/api/account/profile", {
    name: user.name ?? "",
    bio: "",
  });
  const [draft, setDraft] = useState<{ name: string; bio: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const form = draft ?? value;
  const dirty = draft !== null && (draft.name !== value.name || draft.bio !== value.bio);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const next = { name: draft.name.trim(), bio: draft.bio.trim() };
    setSaving(true);
    const ok = await save(next);
    setSaving(false);
    if (!ok) return toast("Couldn't save your profile", "err");
    setDraft(null);
    toast("Profile updated");
    try {
      await update?.({ name: next.name });
    } catch {}
  }

  return (
    <div className="acct-stagger">
      <SectionHead title="Profile" desc="How you appear across the site." />
      <Card>
        {loading ? <Skeleton rows={2} /> : (
          <form onSubmit={submit} className="space-y-5">
            <Field label="Display name" hint={`${form.name.length}/60`}>
              <input className={inputCls} value={form.name} maxLength={60} autoComplete="name"
                onChange={(e) => setDraft({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Short bio" hint={`${form.bio.length}/280`}>
              <textarea className={`${inputCls} h-28 resize-none py-3`} value={form.bio} maxLength={280}
                onChange={(e) => setDraft({ ...form, bio: e.target.value })} />
            </Field>
            <Field label="Email" hint={
              user.emailVerified !== false && (
                <span className="inline-flex items-center gap-1 text-aksum-black"><BadgeCheck size={14} /> Verified</span>
              )}>
              <input className={inputCls} value={user.email} readOnly disabled />
            </Field>
            <div className="flex flex-wrap gap-3 pt-1">
              <Btn type="submit" disabled={!dirty || saving}>{saving ? "Saving…" : "Save changes"}</Btn>
              {dirty && <Btn variant="ghost" onClick={() => setDraft(null)}>Discard</Btn>}
            </div>
            {local && <LocalNote />}
          </form>
        )}
      </Card>
    </div>
  );
}

/* ================================= SAVED ================================= */
interface SavedItem { slug: string; title: string; category?: string; savedAt?: string }

export function Saved({ locale }: { locale: string }) {
  const toast = useToast();
  const { items, setItems, state, reload } = useList<SavedItem>("/api/account/saved");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");

  const shown = useMemo(() => {
    const f = items.filter((i) => i.title.toLowerCase().includes(q.trim().toLowerCase()));
    return [...f].sort((a, b) => {
      const d = (a.savedAt ?? "").localeCompare(b.savedAt ?? "");
      return sort === "new" ? -d : d;
    });
  }, [items, q, sort]);

  async function remove(slug: string) {
    const prev = items;
    setItems(items.filter((i) => i.slug !== slug));
    const r = await api(`/api/account/saved?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
    if (!r.ok) {
      setItems(prev);
      toast(r.error ?? "Couldn't remove it", "err");
    } else toast("Removed from saved");
  }

  return (
    <div className="acct-stagger">
      <SectionHead title="Saved stories" desc="Articles you bookmarked to read later." />
      {state === "loading" && <Skeleton />}
      {state === "missing" && <Empty icon={<Bookmark size={24} />} title="Saving stories isn't switched on yet" text="Once it is, anything you bookmark will appear here." />}
      {state === "error" && <Empty icon={<Bookmark size={24} />} title="Couldn't load your saved stories" action={<Btn onClick={reload}>Try again</Btn>} />}
      {state === "ready" && items.length === 0 && (
        <Empty icon={<Bookmark size={24} />} title="Nothing saved yet" text="Tap the bookmark on any story to keep it here."
          action={<Link href={`/${locale}`} className={btnCls()}>Browse stories</Link>} />
      )}
      {state === "ready" && items.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 basis-56">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-grey/60" />
              <input className={`${inputCls} pl-10`} placeholder="Search saved stories" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search saved stories" />
            </div>
            <select className={`${inputCls} w-auto`} value={sort} onChange={(e) => setSort(e.target.value as "new" | "old")} aria-label="Sort">
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>
          <ul className="space-y-3">
            {shown.map((i) => (
              <li key={i.slug} className="flex items-center gap-3 rounded-2xl border border-obsidian-grey/15 p-4 transition hover:border-aksum-black">
                <div className="min-w-0 flex-1">
                  {i.category && <span className="font-ui text-[11px] font-bold uppercase tracking-wider text-manuscript-red">{i.category}</span>}
                  <Link href={`/${locale}/article/${i.slug}`} className="block font-serif text-lg font-semibold leading-snug text-aksum-black hover:underline">{i.title}</Link>
                  {i.savedAt && <p className="mt-1 font-ui text-xs text-obsidian-grey/70">Saved {fmtDate(i.savedAt, locale)}</p>}
                </div>
                <button type="button" onClick={() => remove(i.slug)} aria-label={`Remove ${i.title}`}
                  className="grid h-11 w-11 flex-none place-items-center rounded-full text-obsidian-grey transition hover:bg-manuscript-red/10 hover:text-manuscript-red">
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
            {shown.length === 0 && <p className="py-8 text-center font-ui text-sm text-obsidian-grey/70">No saved stories match &ldquo;{q}&rdquo;.</p>}
          </ul>
        </>
      )}
    </div>
  );
}

/* =============================== FOLLOWING =============================== */
export function Following({ locale }: { locale: string }) {
  const toast = useToast();
  const { value, save, loading, local } = useSynced("following", "/api/account/following", { topics: [] as string[] });
  const topics = headerNav.filter((i) => i.key !== "home");

  async function toggle(key: string) {
    const has = value.topics.includes(key);
    const ok = await save({ topics: has ? value.topics.filter((t) => t !== key) : [...value.topics, key] });
    if (!ok) toast("Couldn't update your topics", "err");
  }

  return (
    <div className="acct-stagger">
      <SectionHead title="Following" desc="Pick the topics you care about to personalise your experience."
        action={value.topics.length > 0 && <Btn variant="ghost" onClick={() => save({ topics: [] })}>Unfollow all</Btn>} />
      <Card>
        {loading ? <Skeleton rows={2} /> : (
          <>
            <p className="mb-4 font-ui text-xs font-semibold uppercase tracking-wide text-obsidian-grey/70">
              {value.topics.length} topic{value.topics.length === 1 ? "" : "s"} followed
            </p>
            <div className="flex flex-wrap gap-2.5">
              {topics.map((t) => {
                const on = value.topics.includes(t.key);
                return (
                  <button key={t.key} type="button" aria-pressed={on} onClick={() => toggle(t.key)}
                    className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 font-ui text-sm font-semibold transition duration-200 active:scale-95 ${
                      on ? "border-aksum-black bg-aksum-black text-parchment-white" : "border-obsidian-grey/25 text-aksum-black hover:border-aksum-black"}`}>
                    {on ? <Check size={15} /> : <Heart size={15} className="opacity-60" />}
                    {locale === "am" ? t.labelAm : t.label}
                  </button>
                );
              })}
            </div>
            {local && <LocalNote />}
          </>
        )}
      </Card>
    </div>
  );
}

/* ================================ HISTORY ================================ */
interface HistoryItem { slug: string; title: string; readAt?: string }

export function ReadingHistory({ locale }: { locale: string }) {
  const toast = useToast();
  const { items, setItems, state, reload } = useList<HistoryItem>("/api/account/history");

  async function clear() {
    const prev = items;
    setItems([]);
    const r = await api("/api/account/history", { method: "DELETE" });
    if (!r.ok) {
      setItems(prev);
      toast(r.error ?? "Couldn't clear history", "err");
    } else toast("Reading history cleared");
  }

  return (
    <div className="acct-stagger">
      <SectionHead title="Reading history" desc="Stories you've opened recently."
        action={state === "ready" && items.length > 0 && <Btn variant="outline" onClick={clear}><Trash2 size={16} /> Clear history</Btn>} />
      {state === "loading" && <Skeleton />}
      {state === "missing" && <Empty icon={<History size={24} />} title="Reading history isn't switched on yet" />}
      {state === "error" && <Empty icon={<History size={24} />} title="Couldn't load your history" action={<Btn onClick={reload}>Try again</Btn>} />}
      {state === "ready" && items.length === 0 && <Empty icon={<History size={24} />} title="No reading history yet" text="Stories you read will show up here." />}
      {state === "ready" && items.length > 0 && (
        <ul className="divide-y divide-obsidian-grey/10 rounded-2xl border border-obsidian-grey/15 px-5">
          {items.map((i) => (
            <li key={i.slug + i.readAt} className="flex items-center gap-3 py-4">
              <Clock size={16} className="flex-none text-obsidian-grey/50" />
              <Link href={`/${locale}/article/${i.slug}`} className="min-w-0 flex-1 truncate font-ui text-sm font-semibold text-aksum-black hover:underline">{i.title}</Link>
              {i.readAt && <span className="flex-none font-ui text-xs text-obsidian-grey/70">{fmtDate(i.readAt, locale)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================= NOTIFICATIONS ============================= */
export function Notifications({ vapidPublicKey }: { vapidPublicKey: string }) {
  const toast = useToast();
  const { value, save, loading, local } = useSynced("notifications", "/api/account/notifications", {
    breaking: true, daily: false, weekly: true, membership: true, replies: true,
  });
  const set = async (k: keyof typeof value, v: boolean) => {
    if (!(await save({ ...value, [k]: v }))) toast("Couldn't update preferences", "err");
  };
  const rows: [keyof typeof value, string, string][] = [
    ["breaking", "Breaking news emails", "Important stories as they happen."],
    ["daily", "Daily digest", "A morning summary of the day's top stories."],
    ["weekly", "Weekly newsletter", "The week's best reading, every weekend."],
    ["replies", "Replies & mentions", "When someone responds to your comment."],
    ["membership", "Account & billing notices", "Receipts, renewals and security alerts."],
  ];
  return (
    <div className="acct-stagger space-y-6">
      <SectionHead title="Notifications" desc="Choose how and when we get in touch." />
      <Card>
        <h3 className="mb-3 font-ui text-sm font-semibold text-aksum-black">Push notifications on this device</h3>
        <PushOptIn vapidPublicKey={vapidPublicKey} />
      </Card>
      <Card>
        <h3 className="font-ui text-sm font-semibold text-aksum-black">Email</h3>
        {loading ? <div className="mt-3"><Skeleton rows={3} /></div> : (
          <div className="divide-y divide-obsidian-grey/10">
            {rows.map(([k, l, d]) => <Switch key={k} label={l} desc={d} checked={value[k]} onChange={(v) => set(k, v)} />)}
          </div>
        )}
        {local && <LocalNote />}
      </Card>
    </div>
  );
}

/* ================================ MEMBERSHIP ============================== */
export function Membership({ user, locale }: { user: AccountUser; locale: string }) {
  const paid = isPaid(user.membership);
  return (
    <div className="acct-stagger space-y-6">
      <SectionHead title="Membership & billing" />
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-wide text-obsidian-grey/70">Current plan</p>
            <p className="mt-1 flex items-center gap-2 font-serif text-3xl font-semibold capitalize text-aksum-black">
              {paid && <Crown size={24} />} {user.membership}
            </p>
            {paid && user.status && <p className="mt-1 font-ui text-sm text-obsidian-grey/80 capitalize">Status: {user.status}</p>}
            {paid && user.renewsAt && <p className="font-ui text-sm text-obsidian-grey/80">Renews {fmtDate(user.renewsAt, locale)}</p>}
          </div>
          {paid
            ? <ManageBillingButton />
            : <Link href={`/${locale}/membership`} className={btnCls()}><Crown size={16} /> See membership plans</Link>}
        </div>
      </Card>
      <Card>
        <h3 className="font-ui text-sm font-semibold text-aksum-black">Billing</h3>
        <p className="mt-1 font-ui text-sm text-obsidian-grey/80">
          {paid
            ? "Update your payment method, download invoices or cancel anytime in the secure billing portal."
            : "You're on the free plan. Upgrade any time — you'll manage payment details and invoices here."}
        </p>
      </Card>
    </div>
  );
}

/* ================================ SECURITY ================================ */
function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
interface Sess { id: string; device: string; location?: string; lastActive?: string; current?: boolean }

export function Security({ user, locale }: { user: AccountUser; locale: string }) {
  const toast = useToast();
  const canChange = !user.provider || user.provider === "credentials";
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const sessions = useList<Sess>("/api/account/sessions");
  const sc = strength(next);
  const valid = cur.length > 0 && next.length >= 8 && next === again && next !== cur;

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api("/api/account/password", { method: "POST", json: { currentPassword: cur, newPassword: next } });
    setBusy(false);
    if (isMissing(r)) return toast("Password changes aren't enabled yet", "err");
    if (!r.ok) return toast(r.error ?? "Couldn't change password", "err");
    setCur(""); setNext(""); setAgain("");
    toast("Password updated");
  }
  async function revoke(id: string) {
    const prev = sessions.items;
    sessions.setItems(prev.filter((s) => s.id !== id));
    const r = await api(`/api/account/sessions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!r.ok) { sessions.setItems(prev); toast(r.error ?? "Couldn't sign that device out", "err"); }
    else toast("Device signed out");
  }
  async function signOutEverywhere() {
    await api("/api/account/sessions", { method: "DELETE" });
    await signOut({ callbackUrl: `/${locale}` });
  }

  return (
    <div className="acct-stagger space-y-6">
      <SectionHead title="Security" desc="Keep your account safe." />
      <Card>
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-aksum-black" />
          <div>
            <p className="font-ui text-sm font-semibold text-aksum-black">Sign-in method</p>
            <p className="font-ui text-xs capitalize text-obsidian-grey/70">{user.provider && user.provider !== "credentials" ? `${user.provider} account` : "Email & password"}</p>
          </div>
        </div>
      </Card>

      {canChange && (
        <Card>
          <h3 className="mb-4 font-ui text-sm font-semibold text-aksum-black">Change password</h3>
          <form onSubmit={changePassword} className="space-y-4">
            <Field label="Current password"><input className={inputCls} type={show ? "text" : "password"} autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
            <Field label="New password" hint="At least 8 characters">
              <div className="relative">
                <input className={`${inputCls} pr-12`} type={show ? "text" : "password"} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"}
                  className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-obsidian-grey/70 hover:text-aksum-black">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {next && (
                <div className="mt-2 flex gap-1" aria-label={`Password strength ${sc} of 4`}>
                  {[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${n <= sc ? (sc < 2 ? "bg-manuscript-red" : "bg-aksum-black") : "bg-obsidian-grey/15"}`} />)}
                </div>
              )}
            </Field>
            <Field label="Confirm new password" hint={again && again !== next ? <span className="text-manuscript-red">Doesn&apos;t match</span> : undefined}>
              <input className={inputCls} type={show ? "text" : "password"} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} />
            </Field>
            <Btn type="submit" disabled={!valid || busy}>{busy ? "Updating…" : "Update password"}</Btn>
          </form>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-ui text-sm font-semibold text-aksum-black">Where you&apos;re signed in</h3>
        {sessions.state === "ready" && sessions.items.length > 0 && (
          <ul className="mb-4 divide-y divide-obsidian-grey/10">
            {sessions.items.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <Monitor size={18} className="flex-none text-obsidian-grey/60" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-ui text-sm font-semibold text-aksum-black">{s.device}{s.current && <span className="ml-2 rounded-full bg-aksum-black px-2 py-0.5 text-[10px] text-parchment-white">This device</span>}</p>
                  <p className="font-ui text-xs text-obsidian-grey/70">{[s.location, s.lastActive && fmtDate(s.lastActive, locale)].filter(Boolean).join(" · ")}</p>
                </div>
                {!s.current && <Btn variant="ghost" onClick={() => revoke(s.id)}>Sign out</Btn>}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="outline" onClick={() => signOut({ callbackUrl: `/${locale}` })}><LogOut size={16} /> Sign out of this device</Btn>
          {sessions.state === "ready" && <Btn variant="outline" onClick={signOutEverywhere}>Sign out everywhere</Btn>}
        </div>
      </Card>
    </div>
  );
}

/* =============================== PREFERENCES ============================== */
const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("aksum-theme-change", cb);
  window.addEventListener("aksum-text-size-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("aksum-theme-change", cb);
    window.removeEventListener("aksum-text-size-change", cb);
  };
};
const subscribeSaver = (cb: () => void) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-saver"] });
  return () => o.disconnect();
};

function Segmented<T extends string>({ value, onChange, options, label }: {
  value: T; onChange: (v: T) => void; label: string; options: { v: T; label: string; icon?: React.ReactNode }[];
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full bg-obsidian-grey/10 p-1">
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)}
          className={`inline-flex h-10 items-center gap-2 rounded-full px-4 font-ui text-sm font-semibold transition duration-200 ${
            value === o.v ? "bg-aksum-black text-parchment-white shadow" : "text-obsidian-grey hover:text-aksum-black"}`}>
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}

export function Preferences({ locale }: { locale: string }) {
  const pathname = usePathname() ?? `/${locale}/account`;
  const theme = useSyncExternalStore(subscribeStorage, () => localStorage.getItem("aksum-theme") ?? "system", () => "system") as "light" | "dark" | "system";
  const size = useSyncExternalStore(subscribeStorage, () => (localStorage.getItem(TEXT_SIZE_KEY) ?? "m"), () => "m") as TextSize;
  const saver = useSyncExternalStore(subscribeSaver, () => document.documentElement.dataset.saver === "on", () => false);

  function setTheme(t: "light" | "dark" | "system") {
    if (t === "system") localStorage.removeItem("aksum-theme"); else localStorage.setItem("aksum-theme", t);
    const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    window.dispatchEvent(new Event("aksum-theme-change"));
  }
  function setSize(s: TextSize) {
    localStorage.setItem(TEXT_SIZE_KEY, s);
    applyTextSize(s);
    window.dispatchEvent(new Event("aksum-text-size-change"));
  }
  function setSaver(on: boolean) {
    if (on) document.documentElement.dataset.saver = "on"; else delete document.documentElement.dataset.saver;
    try { localStorage.setItem(DATA_SAVER_KEY, on ? "on" : "off"); } catch {}
  }
  const other = locale === "am" ? "en" : "am";
  const switchHref = `${pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${other}`)}?tab=preferences`;

  return (
    <div className="acct-stagger space-y-6">
      <SectionHead title="Preferences" desc="Make reading comfortable. These apply instantly on this device." />
      <Card>
        <h3 className="mb-3 font-ui text-sm font-semibold text-aksum-black">Appearance</h3>
        <Segmented label="Theme" value={theme} onChange={setTheme} options={[
          { v: "light", label: "Light", icon: <Sun size={15} /> },
          { v: "dark", label: "Dark", icon: <Moon size={15} /> },
          { v: "system", label: "System", icon: <Monitor size={15} /> },
        ]} />
      </Card>
      <Card>
        <h3 className="mb-1 font-ui text-sm font-semibold text-aksum-black">Text size</h3>
        <p className="mb-3 font-ui text-xs text-obsidian-grey/70">Scales text across the whole site.</p>
        <Segmented label="Text size" value={size} onChange={setSize} options={(Object.keys(TEXT_SIZES) as TextSize[]).map((k) => ({ v: k, label: { s: "Small", m: "Default", l: "Large", xl: "Extra large" }[k] }))} />
        <p className="mt-4 rounded-xl bg-obsidian-grey/10 p-4 font-serif text-aksum-black">The quick brown fox jumps over the lazy dog.</p>
      </Card>
      <Card>
        <div className="divide-y divide-obsidian-grey/10">
          <Switch label="Data saver" desc="Loads lighter pages and fewer images on slow connections." checked={saver} onChange={setSaver} />
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-ui text-sm font-semibold text-aksum-black">Language</p>
              <p className="font-ui text-xs text-obsidian-grey/70">Currently {locale === "am" ? "አማርኛ" : "English"}</p>
            </div>
            <Link href={switchHref} className={btnCls("outline")}>Switch to {other === "am" ? "አማርኛ" : "English"}</Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================ PRIVACY & DATA ============================= */
export function Privacy({ user }: { user: AccountUser }) {
  const toast = useToast();
  function clearLocal() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(LOCAL_PREFIX) || k === "aksum-recent-searches")
        .forEach((k) => localStorage.removeItem(k));
      toast("Device data cleared");
    } catch {
      toast("Couldn't clear device data", "err");
    }
  }
  return (
    <div className="acct-stagger space-y-6">
      <SectionHead title="Privacy & data" desc="You're in control of your information." />
      <Card>
        <h3 className="font-ui text-sm font-semibold text-aksum-black">Download your data</h3>
        <p className="mb-4 mt-1 font-ui text-sm text-obsidian-grey/80">Get a copy of the personal information we hold about you.</p>
        <DataExportButton />
      </Card>
      <Card>
        <h3 className="font-ui text-sm font-semibold text-aksum-black">Clear data on this device</h3>
        <p className="mb-4 mt-1 font-ui text-sm text-obsidian-grey/80">Removes recent searches and locally stored preferences from this browser. Your account isn&apos;t affected.</p>
        <Btn variant="outline" onClick={clearLocal}>Clear device data</Btn>
      </Card>
      <Card danger>
        <p className="mb-1 font-ui text-xs font-bold uppercase tracking-wide text-manuscript-red">Danger zone</p>
        <p className="mb-4 font-ui text-sm text-obsidian-grey/80">Permanently delete your account and everything linked to it. This cannot be undone.</p>
        <DeleteAccountButton email={user.email} />
      </Card>
    </div>
  );
}
