import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export function generateApiKey(): { key: string; hash: string; preview: string } {
  const key = "aksum_" + randomBytes(24).toString("hex");
  const hash = createHash("sha256").update(key).digest("hex");
  const preview = key.slice(0, 12) + "..." + key.slice(-4);
  return { key, hash, preview };
}

export async function verifyApiKey(request: Request): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7);
  const hash = createHash("sha256").update(key).digest("hex");

  const record = await prisma.apiKey.findUnique({ where: { keyHash: hash } });
  if (!record) return null;

  await prisma.apiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } }).catch(() => {});
  return { userId: record.userId };
}
