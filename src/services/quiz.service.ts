import { QuizModel } from "../models/quiz.model";
import { CategoryModel } from "../models/category.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import { User, Message, Config } from "../utils/enums";
import { PaginatedResponse } from "../types/pagination.types";
import {
  Quiz,
  QuizWithQuestionCount,
  QuizWithCategoryAndCount,
  QuizWithValidation,
  QuizStatus,
  GetQuizzesOptions,
} from "../types/quiz.types";

export class QuizService {
  static async getQuizzes(
    options: GetQuizzesOptions = {}
  ): Promise<PaginatedResponse<QuizWithQuestionCount | QuizWithValidation>> {
    const page = options.pagination?.page || 1;
    const limit = options.pagination?.limit || 10;

    if (options.useValidationView) {
      const quizzesWithValidation = await QuizModel.findQuizzesWithValidation({
        categoryId: options.categoryId,
        minQuestions: Config.Value.MIN_QUESTIONS_PER_QUIZ,
        userId: options.userId,
        userRole: options.userRole,
      });
      
      const total = quizzesWithValidation.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedQuizzes = quizzesWithValidation.slice(startIndex, endIndex);

      return {
        data: paginatedQuizzes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

    if (options.validOnly) {
      const quizzesWithValidation = await QuizModel.findQuizzesWithValidation({
        categoryId: options.categoryId,
        minQuestions: Config.Value.MIN_QUESTIONS_PER_QUIZ,
        userId: options.userId,
        userRole: options.userRole,
      });

      const filteredQuizzes = options.userId && options.userRole !== User.Role.MANAGER
        ? quizzesWithValidation
            .filter((quiz) => quiz.is_valid)
            .map((quiz) => ({
              ...quiz,
              in_progress: quiz.in_progress,
            }))
        : quizzesWithValidation
            .filter((quiz) => quiz.is_valid)
            .map((quiz) => ({
              ...quiz
            }));

      const total = filteredQuizzes.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedQuizzes = filteredQuizzes.slice(startIndex, endIndex);

      return {
        data: paginatedQuizzes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

    const { quizzes, total } = options.categoryId
      ? await QuizModel.findByCategory(options.categoryId, page, limit)
      : await QuizModel.findAll(page, limit);

    const quizzesWithCount = await Promise.all(
      quizzes.map(async (quiz) => {
        const questionCount = await QuizModel.countQuestions(quiz.quiz_id);
        return {
          ...quiz,
          question_count: questionCount,
        } as QuizWithQuestionCount;
      })
    );

    return {
      data: quizzesWithCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getQuizById(id: number): Promise<QuizWithCategoryAndCount> {
    const quiz = await QuizModel.findByIdWithCategory(id);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const questionCount = await QuizModel.countQuestions(id);

    return {
      ...quiz,
      question_count: questionCount,
    };
  }

  static async createQuiz(
    data: CreateQuizDto,
    userRole: string
  ): Promise<Quiz> {
    if (userRole !== User.Role.MANAGER) {
      throw ErrorUtils.forbidden(Message.Error.Role.FORBIDDEN_MANAGER);
    }

    if (data.category_id) {
      const category = await CategoryModel.findById(data.category_id);

      if (!category) {
        throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
      }
    }

    return QuizModel.create(data);
  }

  static async updateQuiz(id: number, data: UpdateQuizDto): Promise<Quiz> {
    const existingQuiz = await QuizModel.findById(id);

    if (!existingQuiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    if (data.category_id !== undefined && data.category_id !== null) {
      const category = await CategoryModel.findById(data.category_id);

      if (!category) {
        throw ErrorUtils.badRequest(Message.Error.Category.INVALID);
      }
    }

    const updatedQuiz = await QuizModel.update(id, data);

    if (!updatedQuiz) {
      throw ErrorUtils.internal(Message.Error.Quiz.UPDATE_FAILED);
    }

    return updatedQuiz;
  }

  static async deleteQuiz(id: number): Promise<void> {
    const existingQuiz = await QuizModel.findById(id);

    if (!existingQuiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const deleted = await QuizModel.softDelete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.Quiz.DELETE_FAILED);
    }
  }

  static async checkQuizStatus(quizId: number): Promise<QuizStatus> {
    const quiz = await QuizModel.findByIdWithCategory(quizId);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const hasEnoughQuestions = await this.checkQuizQuestionCount(quizId);

    return {
      quiz,
      has_enough_questions: hasEnoughQuestions,
      is_ready: hasEnoughQuestions,
    };
  }

  static async checkQuizQuestionCount(quizId: number): Promise<boolean> {
    const count = await QuizModel.countQuestions(quizId);
    return count >= Config.Value.MIN_QUESTIONS_PER_QUIZ;
  }
}
