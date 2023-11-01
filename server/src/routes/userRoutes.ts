import * as express from "express";
import { UserController } from "../controllers/UserController";
import { verifyAccessToken } from "../middleware/verifyAccesstoken";

const router = express.Router();

//user crud
router.get("/", verifyAccessToken, UserController.getAllUsers);
router.get("/:id", verifyAccessToken, UserController.getUserById);

export default router;
