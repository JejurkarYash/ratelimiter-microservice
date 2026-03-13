import { genSalt } from "bcrypt";
import { Router } from "express";
import { generateApiKey } from "../controllers/tenantController.js";

const router:Router = Router(); 


router.post("/api-key",generateApiKey)


export default router;