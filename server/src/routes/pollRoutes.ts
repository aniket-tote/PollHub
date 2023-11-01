import * as express from "express";
import { PollController } from "../controllers/PollController";
import { verifyAccessToken } from "../middleware/verifyAccesstoken";

const router = express.Router();

router.get("/", verifyAccessToken, PollController.getAllPolls);
router.get("/:id", verifyAccessToken, PollController.getPollById);
router.post("/", verifyAccessToken, PollController.createPoll);

export default router;
