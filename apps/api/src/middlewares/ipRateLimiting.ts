import type { Request, Response, NextFunction } from "express";
import redisClient from "../lib/redis.js";
import logger from "../lib/logger.js";

export async function ipRateLimiting(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const key = `ip:${ip}:check`;
  const limit = 1000;
  const window = 60;

  const luaScript = ` 
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])

    local current = tonumber(redis.call("GET",key)) or 0 

    if current >= limit then 
        return { 0, current , redis.call("TTL",key)}
    end 

    if current == 1 then 
        redis.call("EXPIRE",key,window)
    end 

    local newCount = redis.call("INCR",key)

    return { 1, newCount , redis.call("TTL",key)}
  `;
  try {
    const result = (await redisClient.eval(
      luaScript,
      1,
      key,
      limit,
      window,
    )) as [number, number, number];

    if (result[0] == 0) {
      logger.warn("IP Rate Limit: Limit exceeded for IP", { ip, key, limit });
      return res.status(429).json({
        error: {
          code: "IP_RATE_LIMIT_EXCEEDED",
          message: "Too many requests from this IP",
          retryAfter: result[1],
        },
      });
    }

    // calling next function
    next();
  } catch (err: any) {
    logger.error("IP Rate Limit: Error in rate limit evaluation", {
      ip,
      error: err.message || err,
    });
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong on our side",
      },
    });
  }
}
