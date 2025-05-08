import express from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', QuizController.getAllQuizzes);
router.get('/:id/status', QuizController.checkQuizStatus);
router.get('/:id', QuizController.getQuizById);

router.post('/', requireUsername, requireRole('Manager'), QuizController.createQuiz);
router.put('/:id', requireUsername, requireRole('Manager'), QuizController.updateQuiz);
router.delete('/:id', requireUsername, requireRole('Manager'), QuizController.deleteQuiz);


export default router;