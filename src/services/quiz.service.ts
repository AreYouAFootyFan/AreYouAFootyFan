import { QuizModel, Quiz } from '../models/quiz.model';
import { QuestionModel } from '../models/question.model';
import { CategoryModel } from '../models/category.model';
import { ErrorUtils } from '../utils/error.utils';
import { CreateQuizDto, UpdateQuizDto } from '../DTOs/quiz.dto';

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
      throw ErrorUtils.notFound('Category not found');
    }
    
    return QuizModel.findByCategory(categoryId);
  }

  
  static async getQuizById(id: number): Promise<any> {
    const quiz = await QuizModel.findByIdWithCategory(id);
    
    if (!quiz) {
      throw ErrorUtils.notFound('Quiz not found');
    }
    
    const questionCount = await QuizModel.countQuestions(id);
    quiz.question_count = questionCount;
    
    return quiz;
  }

  
  static async createQuiz(data: CreateQuizDto, userRole: string): Promise<Quiz> {
    
    if (userRole !== 'Manager') {
      throw ErrorUtils.forbidden('Only Managers can create quizzes');
    }
    
    if (data.category_id) {
      const category = await CategoryModel.findById(data.category_id);
      
      if (!category) {
        throw ErrorUtils.badRequest('Invalid category ID');
      }
    }
    
    return QuizModel.create(data);
  }

  
  static async updateQuiz(id: number, data: UpdateQuizDto): Promise<Quiz> {
    const existingQuiz = await QuizModel.findById(id);
    
    if (!existingQuiz) {
      throw ErrorUtils.notFound('Quiz not found');
    }
    
    if (data.category_id !== undefined && data.category_id !== null) {
      const category = await CategoryModel.findById(data.category_id);
      
      if (!category) {
        throw ErrorUtils.badRequest('Invalid category ID');
      }
    }
    
    const updatedQuiz = await QuizModel.update(id, data);
    
    if (!updatedQuiz) {
      throw ErrorUtils.internal('Failed to update quiz');
    }
    
    return updatedQuiz;
  }

  
  static async deleteQuiz(id: number): Promise<void> {
    const existingQuiz = await QuizModel.findById(id);
    
    if (!existingQuiz) {
      throw ErrorUtils.notFound('Quiz not found');
    }
    
    const hasAttempts = await QuizModel.hasAttempts(id);
    
    if (hasAttempts) {
      throw ErrorUtils.badRequest('Cannot delete quiz as it has active attempts');
    }
    
    const deleted = await QuizModel.softDelete(id);
    
    if (!deleted) {
      throw ErrorUtils.internal('Failed to delete quiz');
    }
  }

 
  static async checkQuizQuestionCount(quizId: number): Promise<boolean> {
    const count = await QuizModel.countQuestions(quizId);
    return count >= 5;
  }

  static async getValidQuizzes(): Promise<any[]> {
    const allQuizzes = await QuizModel.findAllWithCategories();
    const validQuizzes = [];
    
    for (const quiz of allQuizzes) {
      const questionCount = await QuizModel.countQuestions(quiz.quiz_id);
      if (questionCount < 5) continue;
      
      const questions = await QuestionModel.findByQuizIdWithDetails(quiz.quiz_id);
      
      const allQuestionsValid = questions.every(q => 
        q.answer_count == 4 && q.correct_answer_count == 1
      );
      
      if (allQuestionsValid) {
        validQuizzes.push({
          ...quiz,
          is_valid: true,
          question_count: questionCount
        });
      }
    }
    
    return validQuizzes;
  }
}