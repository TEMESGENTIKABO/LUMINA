import Link from "next/link";
import { Fragment } from "react";
import { prisma } from "@/lib/prisma";
import { GenericBulkSelectTable } from "@/components/admin/GenericBulkSelectTable";
import { bulkDeleteEditions } from "@/lib/admin/actions/editionActions";

export default async function EditionsAdminPage() {
  const editions = await prisma.digitalEdition.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-en text-2xl">Digital Editions</h1>
        <Link
          href="/admin/editions/new"
          className="bg-aksum-black text-parchment-white font-ui text-sm px-4 py-2"
        >
          New Edition
        </Link>
      </div>
      {editions.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey">No editions yet.</p>
      ) : (
        <GenericBulkSelectTable
          items={editions}
          headers={["Issue", "Headline", "Status"]}
          itemLabel="editions"
          onBulkDelete={bulkDeleteEditions}
          rows={editions.map((e) => (
            <Fragment key={e.id}>
              <td className="px-4 py-3 font-ui text-sm">
                <Link
                  href={`/admin/editions/${e.id}`}
                  className="hover:text-manuscript-red"
                >
                  {e.issueLabel}
                </Link>
              </td>
              <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">
                {e.headline}
              </td>
              <td className="px-4 py-3 font-ui text-xs uppercase">
                {e.published ? (
                  <span className="text-manuscript-red">Published</span>
                ) : (
                  <span className="text-obsidian-grey">Draft</span>
                )}
              </td>
            </Fragment>
          ))}
        />
      )}
    </div>
  );
}
