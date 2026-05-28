import type { Request, Response, NextFunction } from "express";
import { hashApiKey } from "../utils/hashApiKey.js";
import { prisma } from "@repo/db";
import logger from "../lib/logger.js";

declare global {
  namespace Express {
    interface Request {
      tenantId: string;
      plan: string;
      apiKeyId: string;
    }
  }
}

export async function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    logger.warn("API Key Middleware: API key not found in request headers");
    return res.status(401).json({
      error: {
        code: "APIKEY_NOT_FOUND",
        message: "api key not found in request headers",
      },
    });
  }
  try {
    // hashing the api key before storing/checking
    const hashedApiKey = hashApiKey(apiKey);

    const validApiKeys = await prisma.apiKey.findUnique({
      where: {
        key: hashedApiKey,
      },
      include: { tenant: true },
    });

    if (!validApiKeys || !validApiKeys.isActive) {
      logger.warn("API Key Middleware: Invalid or inactive API key provided", {
        apiKeyMasked: `sk_****${apiKey.slice(-6)}`,
      });
      return res.status(401).json({
        error: {
          code: "INVALID_API_KEY",
          message: " provide valid api key",
        },
      });
    }
    req.tenantId = validApiKeys.tenantId;
    req.plan = validApiKeys.tenant.plan;
    req.apiKeyId = validApiKeys.id;
    next();
  } catch (err: any) {
    logger.error("API Key Middleware: Error in middleware execution", {
      error: err.message || err,
    });
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong in our end",
      },
      errorDetails: err,
    });
  }
}
