import { prisma } from "@repo/db";
import type { Request, Response } from "express";
import { createRuleSchema, updateRuleSchemaType } from "@repo/types";
import { ZodError } from "zod";
import logger from "../lib/logger.js";

export async function createRule(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const apiKeyId = req.body.apiKeyId;

  try {
    const parseData = createRuleSchema.safeParse(req.body);
    if (!parseData.success) {
      throw parseData.error;
    }

    if (!tenantId) {
      logger.warn("Rule Controllers: Create rule attempt without tenantId in request");
      return res.status(400).json({
        error: "Tenant ID not found in request",
      });
    }

    logger.info("Rule Controllers: Create rule request received", { tenantId, apiKeyId, ruleName: parseData.data.name });

    // verifying the apikey belongs to user
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!apiKey || apiKey.tenantId !== tenantId) {
      logger.warn("Rule Controllers: Create rule forbidden - API key mismatch or invalid", { tenantId, apiKeyId });
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "This API key does not belong to this account",
        },
      });
    }

    const { name, limit, window, algorithm } = parseData.data;
    if (!name || !limit || !window || !algorithm) {
      return res.status(400).json({
        error: "Missing required fields: name, limit, window, algorithm",
      });
    }

    // checking if a rule with the same name already exists for the tenant
    const existingRule = await prisma.rule.findFirst({
      where: {
        tenantId,
        name,
      },
    });

    if (existingRule) {
      logger.warn("Rule Controllers: Create rule failed - rule name already exists for tenant", { tenantId, name });
      return res.status(409).json({
        error: "Rule with the same name already exists for this tenant",
      });
    }

    // creating the new rule in the database
    const newRule = await prisma.rule.create({
      data: {
        name,
        tenantId,
        window,
        algorithm,
        limit,
        apiKeyId,
      },
    });

    logger.info("Rule Controllers: Rule created successfully", { tenantId, ruleId: newRule.id, name: newRule.name });
    return res.status(201).json(newRule);
  } catch (error: any) {
    if (error instanceof ZodError) {
      logger.warn("Rule Controllers: Input validation failed on create rule", { errors: error.flatten() });
      return res.status(400).json({
        error: "Invalid input data",
        errorDetails: error.flatten(),
      });
    }
    logger.error("Rule Controllers: Create rule internal server error", { error: error.message || error });
    return res.status(500).json({
      error: "Internal Server Error",
      errorDetails: error,
    });
  }
}

export async function getRules(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const apiKeyId = req.query.apiKeyId as string | undefined;

  if (!tenantId) {
    logger.warn("Rule Controllers: Get rules request without tenantId");
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!apiKeyId) {
    logger.warn("Rule Controllers: Get rules request without apiKeyId", { tenantId });
    return res.status(400).json({
      error: "API Key ID is required",
    });
  }

  try {
    logger.info("Rule Controllers: Fetching rules list", { tenantId, apiKeyId });
    const rules = await prisma.rule.findMany({
      where: {
        tenantId,
        apiKeyId
      },
    });

    if (!rules) {
      return res.status(404).json({
        error: "No rules found for this tenant",
      });
    }

    logger.info("Rule Controllers: Rules list fetched successfully", { tenantId, apiKeyId, count: rules.length });
    return res.status(200).json(rules);
  } catch (error: any) {
    logger.error("Rule Controllers: Fetch rules internal server error", { tenantId, error: error.message || error });
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export async function updateRule(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const ruleId = req.params.id as string;

  if (!tenantId) {
    logger.warn("Rule Controllers: Update rule request without tenantId");
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!ruleId) {
    logger.warn("Rule Controllers: Update rule request without ruleId", { tenantId });
    return res.status(400).json({
      error: "Rule Id is not found in request",
    });
  }
  try {
    const parseData = updateRuleSchemaType.safeParse(req.body);
    if (!parseData.success || !parseData.data) {
      throw parseData.error;
    }

    const { name, limit, window, algorithm } = parseData.data;
    logger.info("Rule Controllers: Updating rule", { tenantId, ruleId, updates: parseData.data });

    const updatedRule = await prisma.rule.update({
      where: {
        id: ruleId,
        tenantId,
      },
      data: {
        ...(name && { name }),
        ...(limit !== undefined && { limit }),
        ...(window !== undefined && { window }),
        ...(algorithm && { algorithm }),
      },
    });

    if (!updatedRule) {
      logger.warn("Rule Controllers: Update rule failed - rule not found", { tenantId, ruleId });
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }

    logger.info("Rule Controllers: Rule updated successfully", { tenantId, ruleId, name: updatedRule.name });
    return res.status(200).json({
      message: "Rule updated successfully",
      rule: updatedRule,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      logger.warn("Rule Controllers: Input validation failed on update rule", { errors: error.flatten() });
      return res.status(400).json({
        error: "Invalid input data",
        errorDetails: error.flatten(),
      });
    } else if (error.code === "P2025") {
      logger.warn("Rule Controllers: Update rule target rule not found", { tenantId, ruleId });
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }
    logger.error("Rule Controllers: Update rule internal server error", { tenantId, ruleId, error: error.message || error });
    return res.status(500).json({
      error: "Internal Server Error",
      errorDetails: error,
    });
  }
}

export async function deleteRule(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const ruleId = req.params.id as string;

  if (!tenantId) {
    logger.warn("Rule Controllers: Delete rule request without tenantId");
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!ruleId) {
    logger.warn("Rule Controllers: Delete rule request without ruleId", { tenantId });
    return res.status(400).json({
      error: "Rule Id is not found in request",
    });
  }

  try {
    logger.info("Rule Controllers: Deleting rule", { tenantId, ruleId });
    const deletedRule = await prisma.rule.delete({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!deletedRule) {
      logger.warn("Rule Controllers: Delete rule failed - rule not found", { tenantId, ruleId });
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }

    logger.info("Rule Controllers: Rule deleted successfully", { tenantId, ruleId });
    return res.status(200).json({
      message: "Rule deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      logger.warn("Rule Controllers: Delete rule target rule not found", { tenantId, ruleId });
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }
    logger.error("Rule Controllers: Delete rule internal server error", { tenantId, ruleId, error: error.message || error });
    return res.status(500).json({
      error: "Internal Server Error",
      errorDetails: error,
    });
  }
}

export async function getRuleFromId(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const ruleId = req.params.id as string;

  if (!tenantId) {
    logger.warn("Rule Controllers: Get rule by ID request without tenantId");
    return res.status(404).json({
      error: {
        code: "TENANT_ID_NOT_FOUND",
        message: "Provide Tenant id !",
      },
    });
  }

  if (!ruleId) {
    logger.warn("Rule Controllers: Get rule by ID request without ruleId", { tenantId });
    return res.status(404).json({
      error: {
        code: "RULE_ID_REQUIRED",
        message: "provide rule id ",
      },
    });
  }
  try {
    logger.info("Rule Controllers: Fetching rule details by ID", { tenantId, ruleId });
    const rule = await prisma.rule.findUnique({
      where: {
        tenantId,
        id: ruleId,
      },
    });

    if (!rule) {
      logger.warn("Rule Controllers: Get rule by ID failed - rule not found", { tenantId, ruleId });
      return res.status(404).json({
        error: {
          code: "RULE_NOT_FOUND",
          message: `ruleid ${ruleId} not found`,
        },
      });
    }

    logger.info("Rule Controllers: Rule details fetched successfully", { tenantId, ruleId, name: rule.name });
    return res.status(200).json(rule);
  } catch (err: any) {
    logger.error("Rule Controllers: Get rule by ID internal server error", { tenantId, ruleId, error: err.message || err });
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

