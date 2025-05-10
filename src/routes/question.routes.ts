import express from "express";
import { QuestionController } from "../controllers/question.controller";
import {
  authenticate,
  requireUsername,
  requireRole,
} from "../middleware/auth.middleware";
import { User } from "../utils/enums";

const router = express.Router();

router.use(authenticate);

router.get("/quiz/:quizId", QuestionController.getQuestionsByQuizId);
router.get("/:id/validate", QuestionController.validateQuestion);
router.get("/:id", QuestionController.getQuestionById);

router.post(
  "/",
  requireUsername,
  requireRole(User.Role.MANAGER),
  QuestionController.createQuestion
);

router.put(
  "/:id",
  requireUsername,
  requireRole(User.Role.MANAGER),
  QuestionController.updateQuestion
);

router.delete(
  "/:id",
  requireUsername,
  requireRole(User.Role.MANAGER),
  QuestionController.deleteQuestion
);

export default router;
