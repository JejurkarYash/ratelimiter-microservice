import { Router } from "express";
import { sdkCheck } from "../controllers/sdkControllers";

const router: Router = Router();

router.post("/check", sdkCheck);

export default router;
