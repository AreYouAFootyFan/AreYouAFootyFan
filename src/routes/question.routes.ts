import express from 'express';
import { QuestionController } from '../controllers/question.controller';

const router = express.Router();

router.get('/quiz/:quizId', QuestionController.getQuestionsByQuizId);

router.get('/:id/validate', QuestionController.validateQuestion);

router.get('/:id', QuestionController.getQuestionById);

router.post('/', QuestionController.createQuestion);

router.put('/:id', QuestionController.updateQuestion);

router.delete('/:id', QuestionController.deleteQuestion);

export default router;