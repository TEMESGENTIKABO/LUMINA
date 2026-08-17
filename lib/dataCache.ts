import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cached<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  try {
    const hit = await redis.get<T>(key);
    if (hit !== null && hit !== undefined) return hit;
  } catch (error) {
    console.error(`Cache read failed for ${key}:`, error);
  }

  const fresh = await fetcher();

  try {
    await redis.set(key, fresh, { ex: ttlSeconds });
  } catch (error) {
    console.error(`Cache write failed for ${key}:`, error);
  }

  return fresh;
}

export async function invalidateCache(key: string) {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Cache invalidation failed for ${key}:`, error);
  }
}
