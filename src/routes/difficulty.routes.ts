import express from 'express';
import { DifficultyController } from '../controllers/difficulty.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', DifficultyController.getAllDifficultyLevels);
router.get('/:id', DifficultyController.getDifficultyLevelById);

router.post('/', requireUsername, requireRole('Manager'), DifficultyController.createDifficultyLevel);
router.put('/:id', requireUsername, requireRole('Manager'), DifficultyController.updateDifficultyLevel);
router.delete('/:id', requireUsername, requireRole('Manager'), DifficultyController.deleteDifficultyLevel);
export default router;