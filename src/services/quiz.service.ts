import { QuizModel, Quiz } from "../models/quiz.model";
import { QuestionModel } from "../models/question.model";
import { CategoryModel } from "../models/category.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import { User, Message, Config } from "../utils/enums";

export class QuizService {
  static async getAllQuizzes(): Promise<any[]> {
    return QuizModel.findAllWithCategories();
  }

  static async getQuizzesByCreator(userId: number): Promise<Quiz[]> {
    return QuizModel.findByCreator(userId);
  }

  static async getQuizzesByCategory(categoryId: number): Promise<Quiz[]> {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw ErrorUtils.notFound(Message.Error.Category.NOT_FOUND);
    }

    return QuizModel.findByCategory(categoryId);
  }

  static async getQuizById(id: number): Promise<any> {
    const quiz = await QuizModel.findByIdWithCategory(id);

    if (!quiz) {
      throw ErrorUtils.notFound(Message.Error.Quiz.NOT_FOUND);
    }

    const questionCount = await QuizModel.countQuestions(id);
    quiz.question_count = questionCount;

    return quiz;
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

    const hasAttempts = await QuizModel.hasAttempts(id);

    if (hasAttempts) {
      throw ErrorUtils.badRequest(Message.Error.Quiz.HAS_ATTEMPTS);
    }

    const deleted = await QuizModel.softDelete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.Quiz.DELETE_FAILED);
    }
  }

  static async checkQuizQuestionCount(quizId: number): Promise<boolean> {
    const count = await QuizModel.countQuestions(quizId);
    return count >= Config.Value.MIN_QUESTIONS_PER_QUIZ;
  }

  static async getValidQuizzes(): Promise<any[]> {
    const allQuizzes = await QuizModel.findAllWithCategories();
    const validQuizzes = [];

    for (const quiz of allQuizzes) {
      const questionCount = await QuizModel.countQuestions(quiz.quiz_id);
      if (questionCount < Config.Value.MIN_QUESTIONS_PER_QUIZ) continue;

      const questions = await QuestionModel.findByQuizIdWithDetails(
        quiz.quiz_id
      );

      const allQuestionsValid = questions.every(
        (question) =>
          question.answer_count == Config.Value.DEFAULT_ANSWERS_PER_QUESTION &&
          question.correct_answer_count == 1
      );

      if (allQuestionsValid) {
        validQuizzes.push({
          ...quiz,
          is_valid: true,
          question_count: questionCount,
        });
      }
    }

    return validQuizzes;
  }
}
