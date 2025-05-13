import { Request, Response, NextFunction } from "express";
import { QuizAttemptService } from "../services/quiz-attempt.service";
import { CreateQuizAttemptDto } from "../DTOs/quiz-attempt.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Http, Message } from "../utils/enums";

export class QuizAttemptController {
  static async getUserAttempts(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.user!.id;

      const attempts = await QuizAttemptService.getUserAttempts(userId);
      response.json(attempts);
    } catch (error) {
      next(error);
    }
  }

  static async getAttemptById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }
      const userId = request.user!.id;

      const attempt = await QuizAttemptService.getAttemptById(id, userId);
      response.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  static async startQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quiz_id } = request.body;

      if (!quiz_id) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.ID_REQUIRED);
      }

      const userId = request.user!.id;

      const parsedQuizId = parseInt(quiz_id.toString());

      if (isNaN(parsedQuizId)) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
      }

      const data: CreateQuizAttemptDto = {
        user_id: userId,
        quiz_id: parsedQuizId,
      };

      const attempt = await QuizAttemptService.startQuiz(data);
      response.status(Http.Status.CREATED).json(attempt);
    } catch (error) {
      next(error);
    }
  }

  static async getNextQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);

      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      const question = await QuizAttemptService.getNextQuestion(attemptId);

      if (!question) {
        response.json({
          message: "All questions answered",
          completed: true,
        });
      } else {
        response.json(question);
      }
    } catch (error) {
      next(error);
    }
  }

  static async completeQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);

      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      const completedAttempt = await QuizAttemptService.completeQuiz(attemptId);
      response.json(completedAttempt);
    } catch (error) {
      next(error);
    }
  }

  static async getAttemptSummary(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);

      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest(Message.Error.Attempt.INVALID_ID);
      }

      const summary = await QuizAttemptService.getAttemptSummary(attemptId);
      response.json(summary);
    } catch (error) {
      next(error);
    }
  }
}
