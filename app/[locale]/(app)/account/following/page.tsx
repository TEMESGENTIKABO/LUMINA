import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function FollowingPage() {
  const session = await auth();
  const follows = await prisma.followedTopic.findMany({
    where: { userId: session?.user?.id },
  });

  return (
    <div>
      <h1 className="font-headline-en text-[length:var(--text-headline-xl)]">
        Following
      </h1>
      {follows.length === 0 ? (
        <p className="font-ui text-sm text-obsidian-grey mt-6">
          Not following any topics yet.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {follows.map((f) => (
            <li key={f.id} className="font-ui text-sm capitalize">
              {f.topicSlug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
