import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { ApiKeyForm } from "./ApiKeyForm";
import { ApiKeyDeleteButton } from "./ApiKeyDeleteButton";

function formatDate(d: Date | null) {
  if (!d) return "Never";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ApiKeysPage() {
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-2">API Keys</h1>
      <p className="font-ui text-sm text-obsidian-grey mb-6">
        Read-only access to published content via /api/v1. See the docs link below for endpoints.
      </p>

      <ApiKeyForm />

      <AdminTable headers={["Name", "Key", "Created by", "Last used", ""]}>
        {keys.map((k) => (
          <tr key={k.id}>
            <td className="px-4 py-3 font-ui text-sm">{k.name}</td>
            <td className="px-4 py-3 font-ui text-xs text-obsidian-grey">{k.keyPreview}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{k.user.name ?? k.user.email}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{formatDate(k.lastUsedAt)}</td>
            <td className="px-4 py-3 text-right"><ApiKeyDeleteButton id={k.id} name={k.name} /></td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
