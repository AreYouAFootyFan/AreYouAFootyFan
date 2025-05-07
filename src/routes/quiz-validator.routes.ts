import express from 'express';
import { QuizValidatorController } from '../controllers/quiz-validator.controller';
import { authenticate, requireUsername, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);

router.get('/quiz/:quizId', QuizValidatorController.validateQuiz);

router.get('/question/:questionId', QuizValidatorController.validateQuestion);

export default router;