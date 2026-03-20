import { redisClient } from "../lib/redis";
import { getWindowStart } from "./utils/getWindowStart";
import { fixedWindowScript } from "./scripts/index";

interface FixedWindowResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  count: number;
}

type LuaScriptResult = [number, number, number, number];

export async function fixedWindow(
  tenantId: string,
  ruleName: string,
  identifier: string,
  limit: number,
  window: number,
): Promise<FixedWindowResult> {
  try {
    // Calculate the start of the current window
    const windowStart = getWindowStart(window);

    // Construct the Redis key for this tenant, identifier, and rule
    const key = `ratelimit:${tenantId}:${identifier}:${ruleName}:${windowStart}`;

    const result: LuaScriptResult = (await redisClient.eval(
      fixedWindowScript,
      1,
      key,
      limit,
      window,
    )) as LuaScriptResult;

    return {
      allowed: result[0] === 1,
      remaining: result[1],
      resetTime: result[2],
      count: result[3],
    };
  } catch (err) {
    console.error(`[RateLimit Error] fixedwindow failed`, {
      tenantId,
      identifier,
      ruleName,
      err,
    });

    return { allowed: true, remaining: -1, resetTime: 0, count: 0 };
  }
}
