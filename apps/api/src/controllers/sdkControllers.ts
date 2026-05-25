import { prisma } from "@repo/db";
import type { Request, Response } from "express";
import { fixedWindow } from "../services/fixedWindow.js";
import { slidingWindow } from "../services/slidingWindow.js";
import logger from "../lib/logger.js";

export async function sdkCheck(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const plan = req.plan;
  const ruleName = req.body.rule;
  const identifier = req.body.identifier;
  const apiKeyId = req.apiKeyId;

  if (!ruleName || !identifier) {
    logger.warn("SDK Controller: Missing required fields in limit check", { ruleName, identifier });
    return res.status(400).json({
      allowed: false,
      error: {
        code: "MISSING_FEIILDS",
        message: "both feilds are required",
      },
    });
  }

  try {
    // Fetch the rule based on tenantId and ruleName
    const rule = await prisma.rule.findUnique({
      where: {
        apiKeyId_name: {
          name: ruleName,
          apiKeyId: apiKeyId,
        },
      },
    });

    if (!rule) {
      logger.warn("SDK Controller: Rule not found for key", { apiKeyId, ruleName });
      return res.status(404).json({
        error: {
          code: "RULE_NOT_FOUND",
          message: `rule '${ruleName}' not found. create it in your dashboard first`,
        },
      });
    }

    // called apropriate algorithm
    const result =
      rule.algorithm === "FIXED_WINDOW"
        ? await fixedWindow(
            apiKeyId,
            ruleName,
            identifier,
            rule.limit,
            rule.window,
          )
        : await slidingWindow(
            apiKeyId,
            identifier,
            rule.name,
            rule.window,
            rule.limit,
          );

    //  before returning the result log it into the db for analytics
    // fire and forgot
    prisma.usageLog
      .create({
        data: {
          identifier: identifier,
          rule: rule.name,
          allowed: result.allowed,
          count: result.count,
          tenantId: tenantId,
          apiKeyId: apiKeyId,
        },
      })
      .catch((logErr) => logger.error("SDK Controller: UsageLog creation failed", { error: logErr.message || logErr }));

    logger.info("SDK Controller: Rate limit request processed", {
      tenantId,
      apiKeyId,
      ruleName,
      identifier,
      allowed: result.allowed,
      count: result.count,
      remaining: result.remaining,
    });

    // returning the result
    return res.status(result.allowed ? 200 : 429).json({
      allowed: result.allowed,
      remaining: result.remaining,
      resetAt: result.resetTime,
      count: result.count,

      ...(!result.allowed && {
        error: {
          code: "RATE_LIMIT_EXCEED",
          message: "To Many Requests",
        },
      }),
    });
  } catch (err: any) {
    logger.error("SDK Controller: Error executing check", { error: err.message || err });
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong on our side",
      },
    });
  }
}

