import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { generateRawApiKey } from "../utils/generateRawApiKey.js";
import { hashApiKey } from "../utils/hashApiKey.js";
import { resetLimitFunction } from "../services/resetLimit.js";
import id from "zod/v4/locales/id.js";

export async function getTenantInfo(req: Request, res: Response) {
  const tenantId = req.tenantId;

  if (!tenantId) {
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  try {
    const tenantInfo = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenantInfo) {
      return res.status(404).json({
        error: "Tenant not found",
      });
    }

    return res.status(200).json({
      tenantInfo,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export async function generateApiKey(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const name = req.body.name;

  if (!tenantId) {
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!name) {
    return res.status(400).json({
      error: "API key name not found in request",
    });
  }

  try {
    const rawApiKey = generateRawApiKey();
    const hashedApiKey = hashApiKey(rawApiKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        tenantId,
        name,
        key: hashedApiKey,
      },
    });

    return res.status(201).json({
      message: "API Key generated successfully",
      apiKey: rawApiKey,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      errorDetails: error,
    });
  }
}

export async function deleteApiKey(req: Request, res: Response) {
  try {
    const apiKeyId = req.params.id;

    if (!apiKeyId) {
      return res.status(400).json({
        error: "API Key ID not found in request",
      });
    }

    const deletedApiKey = await prisma.apiKey.delete({
      where: {
        id: apiKeyId as string,
      },
    });

    if (!deletedApiKey) {
      return res.status(404).json({
        error: "API Key not found",
      });
    }

    return res.status(200).json({
      message: "API Key deleted successfully",
      apiKey: deletedApiKey,
    });
  } catch (err) {}
}

export async function getUsage(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const identifier = req.params.identifier as string | undefined;
    const rule = req.query.rule as string | undefined;
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!identifier) {
      return res.status(404).json({
        error: {
          code: "IDENTIFER_REQUIRED",
          message: "provide identifier",
        },
      });
    }

    // reusable where clause
    const where = {
      tenantId,
      identifier,
      ...(rule ? { rule } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      }),
    };

    // postgres queries running concurrently
    const [stats, logs] = await Promise.all([
      // counting the records
      prisma.usageLog.groupBy({
        by: ["allowed"],
        where,
        _count: { allowed: true },
      }),

      // paginated logs
      prisma.usageLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          allowed: true,
          count: true,
          rule: true,
          createdAt: true,
        },
      }),
    ]);

    // calculating stats
    const allowedCount =
      stats.find((s) => s.allowed === true)?._count.allowed || 0;
    const blockedCount =
      stats.find((s) => s.allowed === false)?._count.allowed || 0;
    const total = allowedCount + blockedCount;
    const blockRate =
      total > 0 ? ((blockedCount / total) * 100).toFixed(1) + "%" : "0%";

    return res.status(200).json({
      identifier,
      ...(rule && { rule }),
      summary: {
        total,
        allowed: allowedCount,
        blocked: blockedCount,
        blockRate,
      },
      pagination: {
        page,
        limit,
        hasMore: logs.length === limit,
      },
      logs,
    });
  } catch (err) {
    console.error(`getUsage Error `, err);
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "something went wrong on our end",
      errorDetails: err,
    });
  }
}

export async function resetLimit(req: Request, res: Response) {
  const tenantId = req.tenantId;

  if (!tenantId) {
    res.status(404).json({
      error: {
        code: "TENANT_ID_REQUIRED",
        message: "Provide tenandId!",
      },
    });
  }

  const identifier = req.params.identifier as string;
  const ruleName = req.body.rule;

  try {
    const rule = await prisma.rule.findUnique({
      where: {
        tenantId_name: {
          tenantId,
          name: ruleName,
        },
      },
    });

    if (!rule) {
      return res.status(404).json({
        error: {
          code: "RULE_NOT_FOUND",
          message: `rule ${ruleName} does not found !`,
        },
      });
    }

    const result = await resetLimitFunction(
      tenantId,
      identifier,
      rule.name,
      rule.algorithm,
      rule.limit,
      rule.window,
    );

    if (result > 0) {
      return res.status(200).json({
        message: `Reset Successfull for ${identifier}`,
        identifier,
        rule: ruleName,
      });
    } else {
      return res.status(200).json({
        message: `No active limit found for ${identifier} — already cleared or never set`,
        identifier,
        rule: ruleName,
        status: "NOT_FOUND", // nothing to reset, but not an error
      });
    }
  } catch (err) {
    console.error(`Error ResetLimit Fixed Window : `, err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "something went wrong on our side ",
        errorDetails: err,
      },
    });
  }
}
