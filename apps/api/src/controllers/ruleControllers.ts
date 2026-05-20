import { prisma } from "@repo/db";
import type { Request, Response } from "express";
import { createRuleSchema, updateRuleSchemaType } from "@repo/types";
import { ZodError } from "zod";

export async function createRule(req: Request, res: Response) {
  try {
    const tenantId = req.tenantId;
    const parseData = createRuleSchema.safeParse(req.body);
    const apiKeyId = req.body.apiKeyId;
    console.log("parseData: ", parseData);
    if (!parseData.success) {
      throw parseData.error;
    }

    if (!tenantId) {
      return res.status(400).json({
        error: "Tenant ID not found in request",
      });
    }

    // verifying the apikey belongs to user
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!apiKey || apiKey.tenantId !== tenantId) {
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

    return res.status(201).json(newRule);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid input data",
        errorDetails: error.flatten(),
      });
    }
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
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!apiKeyId) {
    return res.status(400).json({
      error: "API Key ID is required",
    });
  }

  try {
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

    return res.status(200).json(rules);
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

export async function updateRule(req: Request, res: Response) {
  const tenantId = req.tenantId;
  const ruleId = req.params.id as string;


  if (!tenantId) {
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!ruleId) {
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
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }

    return res.status(200).json({
      message: "Rule updated successfully",
      rule: updatedRule,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid input data",
        errorDetails: error.flatten(),
      });
    } else if (error.code === "P2025") {
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }
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
    return res.status(400).json({
      error: "Tenant ID not found in request",
    });
  }

  if (!ruleId) {
    return res.status(400).json({
      error: "Rule Id is not found in request",
    });
  }

  try {
    const deletedRule = await prisma.rule.delete({
      where: {
        id: ruleId,
        tenantId,
      },
    });

    if (!deletedRule) {
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }

    return res.status(200).json({
      message: "Rule deleted successfully",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Rule not found for this tenant",
      });
    }
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
    return res.status(404).json({
      error: {
        code: "TENANT_ID_NOT_FOUND",
        message: "Provide Tenant id !",
      },
    });
  }

  if (!ruleId) {
    return res.status(404).json({
      error: {
        code: "RULE_ID_REQUIRED",
        message: "provide rule id ",
      },
    });
  }
  try {
    const rule = await prisma.rule.findUnique({
      where: {
        tenantId,
        id: ruleId,
      },
    });

    if (!rule) {
      return res.status(404).json({
        error: {
          code: "RULE_NOT_FOUND",
          message: `ruleid ${ruleId} not found`,
        },
      });
    }

    return res.status(200).json(rule);
  } catch (err) { }
}
