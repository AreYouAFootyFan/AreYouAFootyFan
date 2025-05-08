import express from 'express';
import { DifficultyController } from '../controllers/difficulty.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../utils/enums';

const router = express.Router();

router.use(authenticate);

router.get('/', DifficultyController.getAllDifficultyLevels);
router.get('/:id', DifficultyController.getDifficultyLevelById);

router.post('/', requireUsername, requireRole(UserRole.MANAGER), DifficultyController.createDifficultyLevel);
router.put('/:id', requireUsername, requireRole(UserRole.MANAGER), DifficultyController.updateDifficultyLevel);
router.delete('/:id', requireUsername, requireRole(UserRole.MANAGER), DifficultyController.deleteDifficultyLevel);
export default router;