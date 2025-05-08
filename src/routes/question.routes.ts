import express from "express";
import { QuestionController } from "../controllers/question.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.use(authenticate);

router.get("/quiz/:quizId", QuestionController.getQuestionsByQuizId);
router.get("/:id/validate", QuestionController.validateQuestion);
router.get("/:id", QuestionController.getQuestionById);

router.post(
  "/",
  requireUsername,
  requireRole(UserRole.MANAGER),
  QuestionController.createQuestion
);

router.put(
  "/:id",
  requireUsername,
  requireRole(UserRole.MANAGER),
  QuestionController.updateQuestion
);

router.delete(
  "/:id",
  requireUsername,
  requireRole(UserRole.MANAGER),
  QuestionController.deleteQuestion
);

export default router;
