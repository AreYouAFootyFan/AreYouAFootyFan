import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quiz.service';
import { CreateQuizDto, UpdateQuizDto } from '../models/quiz.model';
import { ErrorUtils } from '../utils/error.utils';

export class QuizController {
  
  static async getAllQuizzes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validOnly = req.query.valid === 'true';
      
      if (validOnly) {
        const validQuizzes = await QuizService.getValidQuizzes();
        res.json(validQuizzes);
        return;
      }
      
      if (req.query.category) {
        const categoryId = parseInt(req.query.category as string);
        
        if (isNaN(categoryId)) {
          throw ErrorUtils.badRequest('Invalid category ID');
        }
        
        const quizzes = await QuizService.getQuizzesByCategory(categoryId);
        res.json(quizzes);
        return;
      }
      
      if (req.query.creator) {
        const creatorId = parseInt(req.query.creator as string);
        
        if (isNaN(creatorId)) {
          throw ErrorUtils.badRequest('Invalid creator ID');
        }
        
        const quizzes = await QuizService.getQuizzesByCreator(creatorId);
        res.json(quizzes);
        return;
      }
      
      const quizzes = await QuizService.getAllQuizzes();
      res.json(quizzes);
    } catch (error) {
      next(error);
    }
  }

  
  static async getQuizById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      const quiz = await QuizService.getQuizById(id);
      res.json(quiz);
    } catch (error) {
      next(error);
    }
  }

  
  static async createQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quiz_title, quiz_description, category_id } = req.body as CreateQuizDto;
      
      if (!quiz_title) {
        throw ErrorUtils.badRequest('Quiz title is required');
      }
      
      if (quiz_title.length > 64) {
        throw ErrorUtils.badRequest('Quiz title cannot exceed 64 characters');
      }
      
      if (quiz_description && quiz_description.length > 128) {
        throw ErrorUtils.badRequest('Quiz description cannot exceed 128 characters');
      }

      // TODO: Get actual user ID from auth middleware
      // For now, use a placeholder user ID
      const created_by = 1; // This will be replaced with actual user ID from auth
      
      let parsedCategoryId: number | undefined | null = undefined;
      if (category_id !== undefined) {
        if (category_id === null) {
          parsedCategoryId = null;
        } else {
          const tempCategoryId = parseInt(category_id.toString());
          if (isNaN(tempCategoryId)) {
            throw ErrorUtils.badRequest('Invalid category ID');
          }
          parsedCategoryId = tempCategoryId;
        }
      }
      
      const quiz = await QuizService.createQuiz({ 
        quiz_title, 
        quiz_description, 
        category_id: parsedCategoryId, 
        created_by 
      });
      
      res.status(201).json(quiz);
    } catch (error) {
      next(error);
    }
  }

 
  static async updateQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      const { quiz_title, quiz_description, category_id } = req.body as UpdateQuizDto;
      
      if (quiz_title === undefined && quiz_description === undefined && category_id === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      if (quiz_title !== undefined && quiz_title.length > 64) {
        throw ErrorUtils.badRequest('Quiz title cannot exceed 64 characters');
      }
      
      if (quiz_description !== undefined && quiz_description.length > 128) {
        throw ErrorUtils.badRequest('Quiz description cannot exceed 128 characters');
      }
      
      let parsedCategoryId = undefined;
      if (category_id !== undefined) {
        if (category_id === null) {
          parsedCategoryId = null;
        } else {
          parsedCategoryId = parseInt(category_id.toString());
          if (isNaN(parsedCategoryId)) {
            throw ErrorUtils.badRequest('Invalid category ID');
          }
        }
      }
      
      const quiz = await QuizService.updateQuiz(id, { 
        quiz_title, 
        quiz_description, 
        category_id: parsedCategoryId 
      });
      
      res.json(quiz);
    } catch (error) {
      next(error);
    }
  }

  
  static async deleteQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      await QuizService.deleteQuiz(id);
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  
  static async checkQuizStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      const quiz = await QuizService.getQuizById(id);
      
      const hasEnoughQuestions = await QuizService.checkQuizQuestionCount(id);
      
      res.json({
        quiz,
        has_enough_questions: hasEnoughQuestions,
        is_ready: hasEnoughQuestions
      });
    } catch (error) {
      next(error);
    }
  }
}