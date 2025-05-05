import express from 'express';
import { AnswerController } from '../controllers/answer.controller';

const router = express.Router();

router.get('/question/:questionId', AnswerController.getAnswersByQuestionId);

router.get('/:id', AnswerController.getAnswerById);

router.post('/', AnswerController.createAnswer);

router.put('/:id', AnswerController.updateAnswer);

router.delete('/:id', AnswerController.deleteAnswer);

router.put('/:id/mark-correct', AnswerController.markAsCorrect);

export default router;