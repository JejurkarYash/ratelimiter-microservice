import { RateLimiter } from "./client";
import type { Request } from "express";

export interface RateLimiterConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface CheckParams {
  identifier: string;
  rule: string;
}

// Backward compatibility for older consumers using the misspelled type name.
export type CheckParms = CheckParams;

export interface ApiError {
  code: string;
  message: string;
}

export interface CheckResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetAt: number;
  error?: ApiError;
}

export interface MiddlewareConfig {
  limiter: RateLimiter;
  rule: string;
  identifierFn?: (req: Request) => string;
}
