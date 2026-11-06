import "@/components/homepage/home.css";

export default function Loading() {
  return (
    <div
      className="hp-w"
      style={{ padding: "32px 20px" }}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 animate-pulse">
          <div className="aspect-[16/10] rounded-2xl bg-obsidian-grey/10" />
          <div className="mt-5 h-8 w-4/5 rounded bg-obsidian-grey/10" />
          <div className="mt-3 h-4 w-3/5 rounded bg-obsidian-grey/10" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-5 animate-pulse">
          {[0, 1, 2].map((n) => (
            <div key={n} className="flex gap-4">
              <div className="h-20 w-28 rounded-lg bg-obsidian-grey/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/4 rounded bg-obsidian-grey/10" />
                <div className="h-4 w-full rounded bg-obsidian-grey/10" />
                <div className="h-4 w-2/3 rounded bg-obsidian-grey/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
