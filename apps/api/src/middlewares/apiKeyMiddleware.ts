import type { Request, Response, NextFunction } from "express";
import { hashApiKey } from "../utils/hashApiKey";
import { prisma } from "@repo/db";

declare global {
  namespace Express {
    interface Request {
      tenantId: string;
      plan: string;
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
    return res.status(401).json({
      error: {
        code: "APIKEY_NOT_FOUND",
        message: "api key not found in request headers",
      },
    });
  }
  try {
    const hashedApiKey = hashApiKey(apiKey);

    const validApiKeys = await prisma.apiKey.findUnique({
      where: {
        key: hashedApiKey,
      },
      include: { tenant: true },
    });

    if (!validApiKeys || !validApiKeys.isActive) {
      return res.status(401).json({
        error: {
          code: "INVALID_API_KEY",
          message: " provide valid api key",
        },
      });
    }

    req.tenantId = validApiKeys.tenantId;
    req.plan = validApiKeys.tenant.plan;
    next();
  } catch (err) {
    console.error("Error in middleware :", err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong in our end",
      },
      errorDetails: err,
    });
  }
}
