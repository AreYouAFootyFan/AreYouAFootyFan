import express from "express";
import { QuizAttemptController } from "../controllers/quiz-attempt.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { User } from "../utils/enums";

const router = express.Router();

router.use(authenticate);
router.use(requireUsername);
router.use(requireRole(User.Role.PLAYER));

router.get("/my-attempts", QuizAttemptController.getUserAttempts);
router.get("/:id", QuizAttemptController.getAttemptById);
router.get("/:id/next-question", QuizAttemptController.getNextQuestion);
router.get("/:id/summary", QuizAttemptController.getAttemptSummary);
router.post("/start", QuizAttemptController.startQuiz);
router.put("/:id/complete", QuizAttemptController.completeQuiz);

export default router;
