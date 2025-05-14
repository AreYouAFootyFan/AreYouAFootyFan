import express from "express";
import { LeaderboardController } from "../controllers/leaderboard.controller";
import { authenticate, requireUsername } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);

router.get("/", LeaderboardController.getLeaderboard);

router.get("/top", LeaderboardController.getTopPlayers);

router.get("/my-rank", LeaderboardController.getUserRank);

export default router;
