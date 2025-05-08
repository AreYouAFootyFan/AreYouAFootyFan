import express from 'express';
import { AnswerController } from '../controllers/answer.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../utils/enums';

const router = express.Router();

router.use(authenticate);

router.get('/question/:questionId', AnswerController.getAnswersByQuestionId);
router.get('/:id', AnswerController.getAnswerById);

router.post('/', requireUsername, requireRole(UserRole.MANAGER), AnswerController.createAnswer);
router.put('/:id', requireUsername, requireRole(UserRole.MANAGER), AnswerController.updateAnswer);
router.delete('/:id', requireUsername, requireRole(UserRole.MANAGER), AnswerController.deleteAnswer);
router.put('/:id/mark-correct', requireUsername, requireRole(UserRole.MANAGER), AnswerController.markAsCorrect);

export default router;