import { Request, Response, NextFunction } from "express";
import { QuizValidatorService } from "../services/quiz-validator.service";
import { ErrorUtils } from "../utils/error.utils";

export class QuizValidatorController {
  static async validateQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const quizId = parseInt(request.params.quizId);

      if (isNaN(quizId)) {
        throw ErrorUtils.badRequest("Invalid quiz ID");
      }

      const validationResult = await QuizValidatorService.validateQuiz(quizId);
      response.json(validationResult);
    } catch (error) {
      next(error);
    }
  }

  static async validateQuestion(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const questionId = parseInt(request.params.questionId);

      if (isNaN(questionId)) {
        throw ErrorUtils.badRequest("Invalid question ID");
      }

      const validationResult = await QuizValidatorService.validateQuestion(
        questionId
      );
      response.json(validationResult);
    } catch (error) {
      next(error);
    }
  }
}
