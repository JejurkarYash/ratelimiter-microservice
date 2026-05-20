import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { generateRawApiKey } from "../utils/generateRawApiKey.js";
import { hashApiKey } from "../utils/hashApiKey.js";
import { resetLimitFunction } from "../services/resetLimit.js";

export async function getProjects(req: Request, res: Response) {
  const tenantId = req.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant ID not found in request" });
  }

  try {
    // Get all API keys (projects) for this tenant with rule count
    const apiKeys = await prisma.apiKey.findMany({
      where: { tenantId },
      include: {
        _count: { select: { rules: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // For each project, compute today's usage stats from UsageLog
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectsWithStats = await Promise.all(
      apiKeys.map(async (apiKey) => {
        const [requestsToday, blockedToday, lastLog] = await Promise.all([
          // Total requests today for this project
          prisma.usageLog.count({
            where: { apiKeyId: apiKey.id, createdAt: { gte: today } },
          }),
          // Blocked requests today for this project
          prisma.usageLog.count({
            where: { apiKeyId: apiKey.id, allowed: false, createdAt: { gte: today } },
          }),
          // Most recent log entry for "last active" time
          prisma.usageLog.findFirst({
            where: { apiKeyId: apiKey.id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        return {
          id: apiKey.id,
          name: apiKey.name,
          // Mask the key — show only last 6 chars
          apiKeyMasked: `sk_****${apiKey.key.slice(-6)}`,
          isActive: apiKey.isActive,
          rulesCount: apiKey._count.rules,
          requestsToday,
          blockedToday,
          lastActiveAt: lastLog?.createdAt ?? null,
          createdAt: apiKey.createdAt,
        };
      })
    );

    return res.status(200).json(projectsWithStats);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}

export async function getProjectOverview(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const id = req.params.id as string; // Project (ApiKey) ID

  if (!tenantId) return res.status(400).json({ error: "Tenant ID not found in request" });
  if (!id) return res.status(400).json({ error: "Project ID is required" });

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { id, tenantId },
      include: {
        rules: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!apiKey) {
      return res.status(404).json({ error: "Project not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalRequests, blockedRequests, recentActivity, topBlockedRaw] = await Promise.all([
      // Total requests today
      prisma.usageLog.count({ where: { apiKeyId: id, createdAt: { gte: today } } }),
      // Blocked requests today
      prisma.usageLog.count({ where: { apiKeyId: id, allowed: false, createdAt: { gte: today } } }),
      // Recent activity (latest 5 logs)
      prisma.usageLog.findMany({
        where: { apiKeyId: id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { identifier: true, allowed: true, rule: true, createdAt: true }
      }),
      // Top blocked rules
      prisma.usageLog.groupBy({
        by: ['rule'],
        where: { apiKeyId: id, allowed: false },
        _count: { rule: true },
        orderBy: { _count: { rule: 'desc' } },
        take: 4,
      })
    ]);

    const allowedRequests = totalRequests - blockedRequests;

    return res.status(200).json({
      project: {
        id: apiKey.id,
        name: apiKey.name,
        apiKeyMasked: `sk_live_****${apiKey.key.slice(-6)}`,
        isActive: apiKey.isActive,
      },
      stats: {
        totalRequests,
        allowedRequests,
        blockedRequests,
      },
      topBlockedRules: topBlockedRaw.map(r => ({ rule: r.rule, count: r._count.rule })),
      recentActivity,
      rules: apiKey.rules
    });

  } catch (error) {
    console.error("Project overview error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

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
      apiKeyId: apiKey.id,
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
  } catch (err) { }
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
      stats.find((s: any) => s.allowed === true)?._count.allowed || 0;
    const blockedCount =
      stats.find((s: any) => s.allowed === false)?._count.allowed || 0;
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
  const apiKeyId = req.body.apiKeyId;

  try {
    const rule = await prisma.rule.findUnique({
      where: {
        apiKeyId_name: {
          apiKeyId,
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
