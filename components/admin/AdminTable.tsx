export function AdminTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl border border-[#e5e3df] shadow-[0_1px_2px_rgba(26,28,35,0.04)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#faf9f7] border-b border-[#e5e3df]">
            {headers.map((h, i) => (
              <th key={i} className="text-left font-ui text-[11px] font-semibold uppercase tracking-wider text-[#6b6f7a] px-5 py-3.5 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0eeea] [&_tr]:transition-colors [&_tr:hover]:bg-[#faf9f7] [&_td]:px-5 [&_td]:py-3.5 [&_td]:font-ui [&_td]:text-[#1a1c23]">
          {children}
        </tbody>
      </table>
    </div>
  );
}
