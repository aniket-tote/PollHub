import * as express from "express";
import { validateSignup } from "../middleware/validateSignup";
import { AuthController } from "../controllers/AuthController";

const router = express.Router();

router.post("/signup", validateSignup, AuthController.addUser);
router.post("/login", AuthController.loginUser);
router.get("/refresh-token", AuthController.refreshToken);

export default router;
