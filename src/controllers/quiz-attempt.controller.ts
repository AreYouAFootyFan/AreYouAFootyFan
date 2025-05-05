import { Request, Response, NextFunction } from 'express';
import { QuizAttemptService } from '../services/quiz-attempt.service';
import { CreateQuizAttemptDto } from '../models/quiz-attempt.model';
import { ErrorUtils } from '../utils/error.utils';

export class QuizAttemptController {
  
  static async getUserAttempts(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Get user_id from authentication middleware
      // For now, use a placeholder user ID
      const userId = 1; // This should come from auth
      
      const attempts = await QuizAttemptService.getUserAttempts(userId);
      response.json(attempts);
    } catch (error) {
      next(error);
    }
  }

  
  static async getAttemptById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      const attempt = await QuizAttemptService.getAttemptById(id);
      response.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  
  static async startQuiz(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { quiz_id } = request.body;
      
      if (!quiz_id) {
        throw ErrorUtils.badRequest('Quiz ID is required');
      }
      
      // TODO: Get user_id from authentication middleware
      // For now, use a placeholder user ID
      const userId = 1; // This should come from auth
      
      const parsedQuizId = parseInt(quiz_id.toString());
      
      if (isNaN(parsedQuizId)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      const data: CreateQuizAttemptDto = {
        user_id: userId,
        quiz_id: parsedQuizId
      };
      
      const attempt = await QuizAttemptService.startQuiz(data);
      response.status(201).json(attempt);
    } catch (error) {
      next(error);
    }
  }

  
  static async getNextQuestion(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);
      
      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      const question = await QuizAttemptService.getNextQuestion(attemptId);
      
      if (!question) {
        response.json({ 
          message: 'All questions answered', 
          completed: true 
        });
      } else {
        response.json(question);
      }
    } catch (error) {
      next(error);
    }
  }

  
  static async completeQuiz(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);
      
      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      const completedAttempt = await QuizAttemptService.completeQuiz(attemptId);
      response.json(completedAttempt);
    } catch (error) {
      next(error);
    }
  }

  
  static async getAttemptSummary(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = parseInt(request.params.id);
      
      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      const summary = await QuizAttemptService.getAttemptSummary(attemptId);
      response.json(summary);
    } catch (error) {
      next(error);
    }
  }
}