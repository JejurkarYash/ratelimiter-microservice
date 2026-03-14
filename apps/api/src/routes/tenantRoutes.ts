import { genSalt } from "bcrypt";
import { Router } from "express";
import {
  generateApiKey,
  getTenantInfo,
} from "../controllers/tenantController.js";

const router: Router = Router();

router.post("/api-key", generateApiKey);
router.get("/me", getTenantInfo);

export default router;
