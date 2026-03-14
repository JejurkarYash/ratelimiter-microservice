import { Request, Response } from "express";
import { prisma } from "@repo/db";
import { generateRawApiKey } from "../utils/generateRawApiKey.js";
import { hashApiKey } from "../utils/hashApiKey.js";

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
