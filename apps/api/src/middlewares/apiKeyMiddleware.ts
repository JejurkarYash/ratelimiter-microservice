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
      error: "API Key Missing",
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
        error: "Invalid or inactive API Key",
      });
    }

    req.tenantId = validApiKeys.tenantId;
    req.plan = validApiKeys.tenant.plan;
    next();
  } catch (err) {
    console.error("Error hashing API Key:", err); // Debugging log
    return res.status(500).json({
      error: "Internal Server Error",
      errorDetails: err,
    });
  }
}
