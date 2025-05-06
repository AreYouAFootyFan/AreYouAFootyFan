import express from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', QuizController.getAllQuizzes);
router.get('/:id/status', QuizController.checkQuizStatus);
router.get('/:id', QuizController.getQuizById);

router.post('/', requireUsername, requireRole('Quiz Master'), QuizController.createQuiz);
router.put('/:id', requireUsername, requireRole('Quiz Master'), QuizController.updateQuiz);
router.delete('/:id', requireUsername, requireRole('Quiz Master'), QuizController.deleteQuiz);


export default router;