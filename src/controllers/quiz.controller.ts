import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import { ErrorUtils } from "../utils/error.utils";

export class QuizController {
  static async getAllQuizzes(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validOnly = request.query.valid === "true";

      if (validOnly) {
        const validQuizzes = await QuizService.getValidQuizzes();
        response.json(validQuizzes);
        return;
      }

      if (request.query.category) {
        const categoryId = parseInt(request.query.category as string);

        if (isNaN(categoryId)) {
          throw ErrorUtils.badRequest("Invalid category ID");
        }

        const quizzes = await QuizService.getQuizzesByCategory(categoryId);
        response.json(quizzes);
        return;
      }

      if (request.query.creator) {
        const creatorId = parseInt(request.query.creator as string);

        if (isNaN(creatorId)) {
          throw ErrorUtils.badRequest("Invalid creator ID");
        }

        const quizzes = await QuizService.getQuizzesByCreator(creatorId);
        response.json(quizzes);
        return;
      }
      const quizzes = await QuizService.getAllQuizzes();
      response.json(quizzes);
    } catch (error) {
      next(error);
    }
  }

  static async getQuizById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest("Invalid quiz ID");
      }

      const quiz = await QuizService.getQuizById(id);
      response.json(quiz);
    } catch (error) {
      next(error);
    }
  }

  static async createQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quiz_title, quiz_description, category_id } =
        request.body as CreateQuizDto;

      if (!quiz_title) {
        throw ErrorUtils.badRequest("Quiz title is required");
      }

      if (quiz_title.length > 64) {
        throw ErrorUtils.badRequest("Quiz title cannot exceed 64 characters");
      }

      if (quiz_description && quiz_description.length > 128) {
        throw ErrorUtils.badRequest(
          "Quiz description cannot exceed 128 characters"
        );
      }

      const created_by = request.user!.id;
      const user_role = request.user!.role;

      let parsedCategoryId: number | undefined | null = undefined;
      if (category_id !== undefined) {
        if (category_id === null) {
          parsedCategoryId = null;
        } else {
          const tempCategoryId = parseInt(category_id.toString());
          if (isNaN(tempCategoryId)) {
            throw ErrorUtils.badRequest("Invalid category ID");
          }
          parsedCategoryId = tempCategoryId;
        }
      }

      const quiz = await QuizService.createQuiz(
        {
          quiz_title,
          quiz_description,
          category_id: parsedCategoryId,
          created_by,
        },
        user_role
      );

      response.status(201).json(quiz);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest("Invalid quiz ID");
      }

      const { quiz_title, quiz_description, category_id } =
        request.body as UpdateQuizDto;

      if (
        quiz_title === undefined &&
        quiz_description === undefined &&
        category_id === undefined
      ) {
        throw ErrorUtils.badRequest("At least one field to update is required");
      }

      if (quiz_title !== undefined && quiz_title.length > 64) {
        throw ErrorUtils.badRequest("Quiz title cannot exceed 64 characters");
      }

      if (quiz_description !== undefined && quiz_description.length > 128) {
        throw ErrorUtils.badRequest(
          "Quiz description cannot exceed 128 characters"
        );
      }

      let parsedCategoryId = undefined;
      if (category_id !== undefined) {
        if (category_id === null) {
          parsedCategoryId = null;
        } else {
          parsedCategoryId = parseInt(category_id.toString());
          if (isNaN(parsedCategoryId)) {
            throw ErrorUtils.badRequest("Invalid category ID");
          }
        }
      }

      const quiz = await QuizService.updateQuiz(id, {
        quiz_title,
        quiz_description,
        category_id: parsedCategoryId,
      });

      response.json(quiz);
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuiz(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest("Invalid quiz ID");
      }

      await QuizService.deleteQuiz(id);
      response.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async checkQuizStatus(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest("Invalid quiz ID");
      }

      const quiz = await QuizService.getQuizById(id);

      const hasEnoughQuestions = await QuizService.checkQuizQuestionCount(id);

      response.json({
        quiz,
        has_enough_questions: hasEnoughQuestions,
        is_ready: hasEnoughQuestions,
      });
    } catch (error) {
      next(error);
    }
  }
}
