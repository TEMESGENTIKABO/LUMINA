"use client";

import { useState, useTransition } from "react";
import {
  createThemeSchedule,
  deleteThemeSchedule,
} from "@/lib/admin/actions/themeScheduleActions";
import { THEMES } from "@/config/themes";

interface Row {
  id: string;
  name: string;
  theme: number;
  startsAt: string;
  endsAt: string;
}

// Double-check these dates against the Ethiopian calendar before relying on them.
const PRESETS = [
  {
    name: "Genna (Ethiopian Christmas)",
    theme: 8,
    start: "2027-01-06T00:00",
    end: "2027-01-08T23:59",
  },
  {
    name: "Timket (Epiphany)",
    theme: 3,
    start: "2027-01-18T00:00",
    end: "2027-01-20T23:59",
  },
  {
    name: "Fasika (Easter)",
    theme: 4,
    start: "2027-05-01T00:00",
    end: "2027-05-03T23:59",
  },
  {
    name: "Enkutatash (New Year)",
    theme: 9,
    start: "2027-09-11T00:00",
    end: "2027-09-13T23:59",
  },
  {
    name: "Meskel",
    theme: 9,
    start: "2027-09-27T00:00",
    end: "2027-09-29T23:59",
  },
];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  });

const themeName = (id: number) =>
  THEMES.find((t) => t.id === id)?.name ?? `Theme ${id}`;

export function ThemeSchedules({ schedules }: { schedules: Row[] }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    theme: "1",
    startsAt: "",
    endsAt: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    start(async () => {
      const r = await createThemeSchedule(fd);
      setMsg("error" in r && r.error ? r.error : "Scheduled.");
      if (!("error" in r && r.error))
        setForm({ name: "", theme: "1", startsAt: "", endsAt: "" });
    });
  }

  const input =
    "border border-obsidian-grey/20 bg-parchment-white px-3 py-2 font-ui text-sm";

  return (
    <section className="mt-12 max-w-3xl">
      <h2 className="font-headline-en text-xl font-bold">Scheduled themes</h2>
      <p className="font-ui text-xs text-obsidian-grey mt-1">
        Times are Addis Ababa time. A schedule overrides the default theme while
        it is active.
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="font-ui text-xs border border-obsidian-grey/20 px-3 py-1.5 hover:bg-obsidian-grey/5"
            onClick={() =>
              setForm({
                name: p.name,
                theme: String(p.theme),
                startsAt: p.start,
                endsAt: p.end,
              })
            }
          >
            {p.name}
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-4"
      >
        <input
          className={`${input} sm:col-span-2`}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className={input}
          value={form.theme}
          onChange={(e) => setForm({ ...form, theme: e.target.value })}
          aria-label="Theme"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}. {t.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          className={input}
          value={form.startsAt}
          onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
          required
          aria-label="Starts"
        />
        <input
          type="datetime-local"
          className={input}
          value={form.endsAt}
          onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
          required
          aria-label="Ends"
        />
        <button
          disabled={pending}
          className="sm:col-span-5 bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2 w-fit"
        >
          Add schedule
        </button>
      </form>
      {msg && <p className="font-ui text-xs mt-2">{msg}</p>}

      <ul className="mt-6 divide-y divide-obsidian-grey/10">
        {schedules.length === 0 && (
          <li className="font-ui text-sm text-obsidian-grey py-3">
            No schedules yet.
          </li>
        )}
        {schedules.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="font-ui text-sm">
              <p className="font-semibold">
                {s.name}{" "}
                <span className="text-obsidian-grey font-normal">
                  · {s.theme}. {themeName(s.theme)}
                </span>
              </p>
              <p className="text-xs text-obsidian-grey">
                {fmt(s.startsAt)} → {fmt(s.endsAt)}
              </p>
            </div>
            <button
              className="font-ui text-xs underline text-manuscript-red"
              onClick={() =>
                start(async () => {
                  await deleteThemeSchedule(s.id);
                })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
