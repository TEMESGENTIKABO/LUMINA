export function AdminTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full border border-obsidian-grey/10">
      <thead>
        <tr className="border-b border-obsidian-grey/10 bg-obsidian-grey/5">
          {headers.map((h, i) => (
            <th key={i} className="text-left font-ui text-xs uppercase tracking-wide text-obsidian-grey px-4 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-obsidian-grey/10">{children}</tbody>
    </table>
  );
}
