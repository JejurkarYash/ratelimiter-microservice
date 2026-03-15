import { genSalt } from "bcrypt";
import { Router } from "express";

import {
  generateApiKey,
  getTenantInfo,
  deleteApiKey,
} from "../controllers/tenantController.js";

const router: Router = Router();

router.post("/api-key", generateApiKey);
router.get("/me", getTenantInfo);
router.delete("/keys/:id", deleteApiKey);

export default router;
