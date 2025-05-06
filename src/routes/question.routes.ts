import express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/quiz/:quizId', QuestionController.getQuestionsByQuizId);
router.get('/:id/validate', QuestionController.validateQuestion);
router.get('/:id', QuestionController.getQuestionById);

router.post('/', requireUsername, requireRole('Quiz Master'), QuestionController.createQuestion);
router.put('/:id', requireUsername, requireRole('Quiz Master'), QuestionController.updateQuestion);
router.delete('/:id', requireUsername, requireRole('Quiz Master'), QuestionController.deleteQuestion);

export default router;