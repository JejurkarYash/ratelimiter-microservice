import type { Request, Response } from "express";

export function sdkCheck(req: Request, res: Response) {
  return res.json({ message: "SDK Check successful" });
}
