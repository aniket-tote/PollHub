import * as express from "express";
import { PollController } from "../controllers/PollController";
import { verifyAccessToken } from "../middleware/verifyAccesstoken";

const router = express.Router();

router.get("/", verifyAccessToken, PollController.getAllPolls);
router.get("/by-user", verifyAccessToken, PollController.getPollsByUser);
router.get("/:id", verifyAccessToken, PollController.getPollById);
router.post("/", verifyAccessToken, PollController.createPoll);
router.put("/vote/:id", verifyAccessToken, PollController.vote);

export default router;
