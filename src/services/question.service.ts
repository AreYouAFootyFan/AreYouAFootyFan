import { QuestionModel, Question } from '../models/question.model';
import { QuizModel } from '../models/quiz.model';
import { DifficultyLevelModel } from '../models/difficulty.model';
import { ErrorUtils } from '../utils/error.utils';
import { CreateQuestionDto, UpdateQuestionDto } from '../DTOs/question.dto';

export class QuestionService {

  static async getQuestionsByQuizId(quizId: number): Promise<any[]> {
    const quiz = await QuizModel.findById(quizId);
    
    if (!quiz) {
      throw ErrorUtils.notFound('Quiz not found');
    }
    
    return QuestionModel.findByQuizIdWithDetails(quizId);
  }

 
  static async getQuestionById(id: number): Promise<any> {
    const question = await QuestionModel.findByIdWithDifficulty(id);
    
    if (!question) {
      throw ErrorUtils.notFound('Question not found');
    }
    
    const answerCount = await QuestionModel.countAnswers(id);
    question.answer_count = answerCount;
    
    const correctAnswerCount = await QuestionModel.countCorrectAnswers(id);
    question.correct_answer_count = correctAnswerCount;
    
    return question;
  }

 
  static async createQuestion(data: CreateQuestionDto): Promise<Question> {
    const quiz = await QuizModel.findById(data.quiz_id);
    
    if (!quiz) {
      throw ErrorUtils.badRequest('Invalid quiz ID');
    }
    
    const difficultyLevel = await DifficultyLevelModel.findById(data.difficulty_id);
    
    if (!difficultyLevel) {
      throw ErrorUtils.badRequest('Invalid difficulty level ID');
    }
    
    return QuestionModel.create(data);
  }

  
  static async updateQuestion(id: number, data: UpdateQuestionDto): Promise<Question> {
    const existingQuestion = await QuestionModel.findById(id);
    
    if (!existingQuestion) {
      throw ErrorUtils.notFound('Question not found');
    }
    
    if (data.difficulty_id !== undefined) {
      const difficultyLevel = await DifficultyLevelModel.findById(data.difficulty_id);
      
      if (!difficultyLevel) {
        throw ErrorUtils.badRequest('Invalid difficulty level ID');
      }
    }
    
    const updatedQuestion = await QuestionModel.update(id, data);
    
    if (!updatedQuestion) {
      throw ErrorUtils.internal('Failed to update question');
    }
    
    return updatedQuestion;
  }

  
  static async deleteQuestion(id: number): Promise<void> {
    const existingQuestion = await QuestionModel.findById(id);
    
    if (!existingQuestion) {
      throw ErrorUtils.notFound('Question not found');
    }
    
    const deleted = await QuestionModel.delete(id);
    
    if (!deleted) {
      throw ErrorUtils.internal('Failed to delete question');
    }
  }


  static async validateQuestionAnswers(questionId: number): Promise<{ isValid: boolean, message: string }> {
    const answerCount = await QuestionModel.countAnswers(questionId);
    const correctAnswerCount = await QuestionModel.countCorrectAnswers(questionId);
    
    if (answerCount < 4) {
      return {
        isValid: false,
        message: `Question requires 4 answer options, currently has ${answerCount}`
      };
    }
    
    if (correctAnswerCount !== 1) {
      return {
        isValid: false,
        message: `Question requires exactly 1 correct answer, currently has ${correctAnswerCount}`
      };
    }
    
    return {
      isValid: true,
      message: 'Question has valid answers'
    };
  }
}