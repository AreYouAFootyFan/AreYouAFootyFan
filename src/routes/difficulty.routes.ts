import express from 'express';
import { DifficultyController } from '../controllers/difficulty.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', DifficultyController.getAllDifficultyLevels);
router.get('/:id', DifficultyController.getDifficultyLevelById);

router.post('/', requireUsername, requireRole('Quiz Master'), DifficultyController.createDifficultyLevel);
router.put('/:id', requireUsername, requireRole('Quiz Master'), DifficultyController.updateDifficultyLevel);
router.delete('/:id', requireUsername, requireRole('Quiz Master'), DifficultyController.deleteDifficultyLevel);
export default router;