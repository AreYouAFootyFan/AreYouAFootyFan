import express from 'express';
import { DifficultyController } from '../controllers/difficulty.controller';

const router = express.Router();

router.get('/', DifficultyController.getAllDifficultyLevels);

router.get('/:id', DifficultyController.getDifficultyLevelById);

router.post('/', DifficultyController.createDifficultyLevel);

router.put('/:id', DifficultyController.updateDifficultyLevel);

router.delete('/:id', DifficultyController.deleteDifficultyLevel);

export default router;