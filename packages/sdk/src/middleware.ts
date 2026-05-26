import { RateLimiter } from "./client";
import { RateLimiterError } from "./error";
import { CheckResult, MiddlewareConfig } from "./types";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      rateLimitResult?: CheckResult;
    }
  }
}

export function RateLimitermiddleware(config: MiddlewareConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = config.identifierFn
      ? config.identifierFn(req)
      : req.ip || "UNKNOWN";

    try {
      const result = await config.limiter.check({
        identifier,
        rule: config.rule,
      });

      req.rateLimitResult = result;

      if (!result.allowed) {
        return res.status(429).json({
          error: {
            code: "RATE_LIMIT_EXCEED",
            message: "Too Many Requests",
          },
        });
      }

      next();
    } catch (err) {
      if (err instanceof RateLimiterError) {
        console.error(`[RateLimiter] ${err.code}: ${err.message}`);
      } else {
        console.error(`[RateLimiter] Unexpected Error...`, err);
      }

      next();
    }
  };
}

export function rateLimiterMiddleware(config: MiddlewareConfig) {
  return RateLimitermiddleware(config);
}

export const RateLimiterMiddleware = RateLimitermiddleware;
