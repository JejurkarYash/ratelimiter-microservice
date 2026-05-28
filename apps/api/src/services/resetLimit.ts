import { getWindowStart } from "./utils/getWindowStart.js";
import redisClient from "../lib/redis.js";

export async function resetLimitFunction(
  tenantId: string,
  identifier: string,
  ruleName: string,
  algorithm: string,
  limit: number,
  window: number,
) {
  let key: string;
  if (algorithm === "FIXED_WINDOW") {
    const windowStart = getWindowStart(window);
    key = `ratelimit:${tenantId}:${identifier}:${ruleName}:${windowStart}`;
  } else {
    key = `ratelimit:${tenantId}:${identifier}:${ruleName}`;
  }

  // deleting the key from redis
  const result = await redisClient.del(key);
  return result;
}
