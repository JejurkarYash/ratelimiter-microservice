import { Router } from "express";
import {
  createRule,
  deleteRule,
  updateRule,
  getRules,
} from "../controllers/ruleControllers";

const router: Router = Router();

router.post("/create-rule", createRule);
router.get("/get-rules", getRules);
router.delete("/rule/:id", deleteRule);
router.put("/rule/:id", updateRule);

export default router;
