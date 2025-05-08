import express from 'express';
import { AnswerController } from '../controllers/answer.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/question/:questionId', AnswerController.getAnswersByQuestionId);
router.get('/:id', AnswerController.getAnswerById);

router.post('/', requireUsername, requireRole('Manager'), AnswerController.createAnswer);
router.put('/:id', requireUsername, requireRole('Manager'), AnswerController.updateAnswer);
router.delete('/:id', requireUsername, requireRole('Manager'), AnswerController.deleteAnswer);
router.put('/:id/mark-correct', requireUsername, requireRole('Manager'), AnswerController.markAsCorrect);

export default router;