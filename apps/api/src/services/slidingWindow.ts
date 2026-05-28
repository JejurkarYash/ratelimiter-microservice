import redisClient from "../lib/redis.js";
import { slidingWindowScript } from "./scripts/index.js";

interface slidingWindowResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  count: number;
}

type result = [number, number, number, number];

export async function slidingWindow(
  apiKeyId: string,
  identifier: string,
  ruleName: string,
  window: number,
  limit: number,
): Promise<slidingWindowResult> {
  try {
    const now = Date.now();
    const windowMs = window * 1000;
    const windowStart = now - windowMs;

    const key = `ratelimit:${apiKeyId}:${identifier}:${ruleName}`;
    const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

    const result = (await redisClient.eval(
      slidingWindowScript,
      1,
      key,
      String(now),
      String(windowStart),
      String(windowMs),
      String(limit),
      member,
    )) as result;

    return {
      allowed: result[0] == 1,
      remaining: result[1],
      resetTime: result[2],
      count: result[3],
    };
  } catch (err) {
    console.error(`[RateLimit Error] slidingwindow failed`, {
      apiKeyId,
      identifier,
      ruleName,
      err,
    });

    return { allowed: true, remaining: -1, resetTime: 0, count: 0 };
  }
}
