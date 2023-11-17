import * as express from "express";
import { PollController } from "../controllers/PollController";
import { verifyAccessToken } from "../middleware/verifyAccesstoken";

const router = express.Router();

router.get("/", verifyAccessToken, PollController.getAllPolls);
router.post("/", verifyAccessToken, PollController.createPoll);
router.get("/by-user", verifyAccessToken, PollController.getPollsByUser);
router.get("/active", verifyAccessToken, PollController.getActivePolls);
router.get("/inactive", verifyAccessToken, PollController.getInactivePolls);
router.put("/:pollId/vote/:optionId", verifyAccessToken, PollController.vote);
router.put(
  "/:pollId/unvote/:optionId",
  verifyAccessToken,
  PollController.unvote
);
router.get("/:id", verifyAccessToken, PollController.getPollById);

export default router;
