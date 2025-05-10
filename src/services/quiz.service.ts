import { QuizModel, Quiz } from "../models/quiz.model";
import { QuizAttemptModel } from "../models/quiz-attempt.model";
import { QuestionModel } from "../models/question.model";
import { CategoryModel } from "../models/category.model";
import { ErrorUtils } from "../utils/error.utils";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import { User, Message, Config } from "../utils/enums";

export class QuizService {

static async getQuizzes(options: {
    userId?: number;
    categoryId?: number;
    creatorId?: number;
    validOnly?: boolean;
    userRole?: string;
  } = {}): Promise<any[]> {
    
    let quizzes = await QuizModel.findAllWithCategories();
    
    if (options.categoryId) {
      const category = await CategoryModel.findById(options.categoryId);
      if (!category) {
        throw ErrorUtils.notFound(Message.Error.Category.NOT_FOUND);
      }
      quizzes = quizzes.filter(quiz => quiz.category_id === options.categoryId);
    }
    
    if (options.creatorId) {
      quizzes = quizzes.filter(quiz => quiz.created_by === options.creatorId);
    }
    
    if (options.validOnly && options.userId) {
      const validQuizzes = [];
      
      for (const quiz of quizzes) {
        const questionCount = await QuizModel.countQuestions(quiz.quiz_id);
        if (questionCount < Config.Value.MIN_QUESTIONS_PER_QUIZ) continue;
        
        const questions = await QuestionModel.findByQuizIdWithDetails(quiz.quiz_id);
        const allQuestionsValid = questions.every(
          (question) =>
            question.answer_count == Config.Value.DEFAULT_ANSWERS_PER_QUESTION &&
            question.correct_answer_count == 1
        );
        if (!allQuestionsValid) continue;
        
        if (options.userId && options.userRole !== User.Role.MANAGER) {
          const attempts = await QuizAttemptModel.findByUserIdAndQuizId(
            options.userId,
            quiz.quiz_id
          );
          
          const hasCompletedAttempt = attempts.some(attempt => attempt.end_time !== null);
          if (hasCompletedAttempt) continue;
          
          const hasIncompleteAttempt = attempts.some(attempt => attempt.end_time === null);
          validQuizzes.push({
            ...quiz,
            is_valid: true,
            question_count: questionCount,
            in_progress: hasIncompleteAttempt
          });
        } else {
          validQuizzes.push({
            ...quiz,
            is_valid: true,
            question_count: questionCount
          });
        }
      }
      
      return validQuizzes;
    }
    
    return Promise.all(quizzes.map(async quiz => {
      const questionCount = await QuizModel.countQuestions(quiz.quiz_id);
      return {
        ...quiz,
        question_count: questionCount
      };
    }));
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
}
