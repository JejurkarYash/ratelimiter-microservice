import { genSalt } from "bcrypt";
import { Router } from "express";

import {
  generateApiKey,
  getTenantInfo,
  deleteApiKey,
  getUsage,
  resetLimit,
  getProjects,
  getProjectOverview,
  getProjectLogs,
} from "../controllers/tenantController.js";

const router: Router = Router();

// get all projects (API keys) with stats
router.get("/projects", getProjects);
// get project overview data
router.get("/projects/:id/overview", getProjectOverview);
// get project logs
router.get("/projects/:id/logs", getProjectLogs);
// generate api key
router.post("/api-key", generateApiKey);
// get profile data
router.get("/me", getTenantInfo);
// delete api key
router.delete("/keys/:id", deleteApiKey);
// get usage of identifier for dashboard/ analytics
router.get("/usage/:identifier", getUsage);
// reset the user manually
router.post("/reset/:identifier", resetLimit);

export default router;
