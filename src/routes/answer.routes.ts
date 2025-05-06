import express from 'express';
import { AnswerController } from '../controllers/answer.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/question/:questionId', AnswerController.getAnswersByQuestionId);
router.get('/:id', AnswerController.getAnswerById);

router.post('/', requireUsername, requireRole('Quiz Master'), AnswerController.createAnswer);
router.put('/:id', requireUsername, requireRole('Quiz Master'), AnswerController.updateAnswer);
router.delete('/:id', requireUsername, requireRole('Quiz Master'), AnswerController.deleteAnswer);
router.put('/:id/mark-correct', requireUsername, requireRole('Quiz Master'), AnswerController.markAsCorrect);

export default router;