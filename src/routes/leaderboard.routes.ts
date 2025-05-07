import express from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { authenticate, requireUsername } from '../middleware/auth.middleware';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(requireUsername);

// Get the full leaderboard
router.get('/', LeaderboardController.getLeaderboard);

// Get the top N players (default is 5)
router.get('/top', LeaderboardController.getTopPlayers);

// Get the current user's rank
router.get('/my-rank', LeaderboardController.getUserRank);

export default router;