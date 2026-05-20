import { z } from "zod";

export const Algorithm = {
  FIXED_WINDOW: "FIXED_WINDOW",
  SLIDING_WINDOW: "SLIDING_WINDOW",
} as const;

export type Algorithm = (typeof Algorithm)[keyof typeof Algorithm];

export const createRuleSchema = z.object({
  name: z.string(),
  limit: z.number(),
  algorithm: z.enum([Algorithm.FIXED_WINDOW, Algorithm.SLIDING_WINDOW]),
  window: z.number(),
  apiKeyId: z.string()
});

export const updateRuleSchemaType = z.object({
  name: z.string().optional(),
  limit: z.number().optional(),
  algorithm: z
    .enum([Algorithm.FIXED_WINDOW, Algorithm.SLIDING_WINDOW])
    .optional(),
  window: z.number().optional(),
});
