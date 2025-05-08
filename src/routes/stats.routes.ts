import express from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);
router.use(requireRole('Manager'));

router.get('/dashboard', StatsController.getDashboardStats);

export default router;