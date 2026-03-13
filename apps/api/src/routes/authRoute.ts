import {Router} from "express"
import authController from "../controllers/authController.js";

const router: Router = Router();

router.post("/google-login", authController)
export default router;


