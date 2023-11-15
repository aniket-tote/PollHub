import * as express from "express";
import { PollController } from "../controllers/PollController";
import { verifyAccessToken } from "../middleware/verifyAccesstoken";

const router = express.Router();

router.get("/", verifyAccessToken, PollController.getAllPolls);
router.post("/", verifyAccessToken, PollController.createPoll);
router.get("/by-user", verifyAccessToken, PollController.getPollsByUser);
router.get("/active", verifyAccessToken, PollController.getActivePolls);
router.get("/inactive", verifyAccessToken, PollController.getInactivePolls);
router.get("/:id", verifyAccessToken, PollController.getPollById);
router.put("/vote/:id", verifyAccessToken, PollController.vote);

export default router;
