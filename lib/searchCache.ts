import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SEARCH_CACHE_TTL_SECONDS = 60;

export async function getCachedSearch<T>(query: string): Promise<T | null> {
  try {
    const key = `search:${query.toLowerCase().trim()}`;
    const cached = await redis.get<T>(key);
    return cached ?? null;
  } catch (error) {
    // Cache failures should never break search - fall through to a live query.
    console.error("Search cache read failed:", error);
    return null;
  }
}

export async function setCachedSearch<T>(query: string, results: T): Promise<void> {
  try {
    const key = `search:${query.toLowerCase().trim()}`;
    await redis.set(key, results, { ex: SEARCH_CACHE_TTL_SECONDS });
  } catch (error) {
    console.error("Search cache write failed:", error);
  }
}
