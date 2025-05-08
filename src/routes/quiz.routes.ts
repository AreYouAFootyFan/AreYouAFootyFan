import express from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../utils/enums';

const router = express.Router();

router.use(authenticate);

router.get('/', QuizController.getAllQuizzes);
router.get('/:id/status', QuizController.checkQuizStatus);
router.get('/:id', QuizController.getQuizById);

router.post('/', requireUsername, requireRole(UserRole.MANAGER), QuizController.createQuiz);
router.put('/:id', requireUsername, requireRole(UserRole.MANAGER), QuizController.updateQuiz);
router.delete('/:id', requireUsername, requireRole(UserRole.MANAGER), QuizController.deleteQuiz);

export default router;