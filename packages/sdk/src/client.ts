import { RateLimiterConfig, CheckParams, CheckResult } from "./types";
import { RateLimiterError } from "./error";
const DEFAULT_BASE_URL = "https://repoapi-production-fcf8.up.railway.app/sdk";

export class RateLimiter {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: RateLimiterConfig) {
    if (!config.apiKey) {
      throw new RateLimiterError("MISSING_API_KEY", "API Key is required", 401);
    }
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl as string) ?? DEFAULT_BASE_URL;
  }

  //   check method of checking rate limits
  async check(params: CheckParams): Promise<CheckResult> {
    if (!params.identifier || !params.rule) {
      throw new RateLimiterError(
        "MISSING_FIELDS",
        "Identifier and Rule are required",
        400,
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          identifier: params.identifier,
          rule: params.rule,
        }),
      });

      const data = (await response.json()) as any;

      if (!response.ok && response.status !== 429) {
        throw new RateLimiterError(
          data.error.code || "UNKNOWN_ERROR",
          data.error.message || "Something went wrong",
          response.status,
        );
      }

      return data as CheckResult;
    } catch (err) {
      if (err instanceof RateLimiterError) throw err;

      throw new RateLimiterError(
        "NETWORK_ERROR",
        "Request could not reach ratelimiter API",
        503,
      );
    }
  }
}
