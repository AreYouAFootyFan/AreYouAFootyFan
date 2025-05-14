import { Request, Response, NextFunction } from "express";
import { QuizService } from "../services/quiz.service";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Http, Length } from "../utils/enums";

export class QuizController {
  static async getQuizzes(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validOnly = request.body.valid === true;
      const { page = 1, limit = 10, categoryId } = request.body;

      // Validate pagination parameters
      if (!Number.isInteger(page) || page < 1) {
        throw ErrorUtils.badRequest("Page number must be a positive integer");
      }
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw ErrorUtils.badRequest("Limit must be between 1 and 100");
      }

      // Parse categoryId if provided
      let parsedCategoryId: number | undefined;
      if (categoryId !== undefined) {
        parsedCategoryId = parseInt(categoryId.toString());
        if (isNaN(parsedCategoryId)) {
          throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
        }
      }

      const userId = request.user?.id;
      const userRole = request.user?.role;

      const quizzes = await QuizService.getQuizzes({
        userId,
        userRole,
        categoryId: parsedCategoryId,
        validOnly,
        pagination: {
          page,
          limit
        }
      });

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
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
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
        throw ErrorUtils.badRequest(Message.Error.Quiz.TITLE_REQUIRED);
      }

      if (quiz_title.length < Length.Min.QUIZ_TITLE) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.TITLE_TOO_SHORT);
      }

      if (quiz_title.length > Length.Max.QUIZ_TITLE) {
        throw ErrorUtils.badRequest(Message.Error.Quiz.TITLE_TOO_LONG);
      }

      if (quiz_description) {
        if (quiz_description.length < Length.Min.QUIZ_DESCRIPTION) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.DESCRIPTION_TOO_SHORT);
        }

        if (quiz_description.length > Length.Max.QUIZ_DESCRIPTION) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.DESCRIPTION_TOO_LONG);
        }
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
            throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
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

      response.status(Http.Status.CREATED).json(quiz);
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
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
      }

      const { quiz_title, quiz_description, category_id } =
        request.body as UpdateQuizDto;

      if (
        quiz_title === undefined &&
        quiz_description === undefined &&
        category_id === undefined
      ) {
        throw ErrorUtils.badRequest(
          Message.Error.Permission.NO_FIELD_TO_UPDATE
        );
      }

      if (quiz_title !== undefined) {
        if (quiz_title.length < Length.Min.QUIZ_TITLE) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.TITLE_TOO_SHORT);
        }

        if (quiz_title.length > Length.Max.QUIZ_TITLE) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.TITLE_TOO_LONG);
        }
      }

      if (quiz_description !== undefined) {
        if (quiz_description.length < Length.Min.QUIZ_DESCRIPTION) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.DESCRIPTION_TOO_SHORT);
        }

        if (quiz_description.length > Length.Max.QUIZ_DESCRIPTION) {
          throw ErrorUtils.badRequest(Message.Error.Quiz.DESCRIPTION_TOO_LONG);
        }
      }

      let parsedCategoryId = undefined;
      if (category_id !== undefined) {
        if (category_id === null) {
          parsedCategoryId = null;
        } else {
          parsedCategoryId = parseInt(category_id.toString());
          if (isNaN(parsedCategoryId)) {
            throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
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
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
      }

      await QuizService.deleteQuiz(id);
      response.json({ message: Message.Success.Quiz.DELETE });
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
        throw ErrorUtils.badRequest(Message.Error.Quiz.INVALID_ID);
      }

      const quizStatus = await QuizService.checkQuizStatus(id);
      response.json(quizStatus);
    } catch (error) {
      next(error);
    }
  }
}
