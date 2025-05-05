import express from 'express';
import { QuizController } from '../controllers/quiz.controller';

const router = express.Router();

router.get('/', QuizController.getAllQuizzes);

router.get('/:id/status', QuizController.checkQuizStatus);

router.get('/:id', QuizController.getQuizById);

router.post('/', QuizController.createQuiz);

router.put('/:id', QuizController.updateQuiz);

router.delete('/:id', QuizController.deleteQuiz);

export default router;