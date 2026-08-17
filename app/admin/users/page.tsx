import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminTable } from "@/components/admin/AdminTable";
import { UserRoleSelect } from "@/components/admin/UserRoleSelect";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function UsersPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="font-headline-en text-2xl mb-6">Users</h1>

      <AdminTable headers={["Name", "Email", "Role", "Articles", "Joined"]}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="px-4 py-3 font-ui text-sm">{user.name ?? "-"}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{user.email}</td>
            <td className="px-4 py-3">
              <UserRoleSelect
                userId={user.id}
                currentRole={user.role}
                isCurrentUser={user.id === session?.user?.id}
              />
            </td>
            <td className="px-4 py-3 font-ui text-sm">{user._count.articles}</td>
            <td className="px-4 py-3 font-ui text-sm text-obsidian-grey">{formatDate(user.createdAt)}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
