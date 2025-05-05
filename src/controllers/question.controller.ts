import { Request, Response, NextFunction } from 'express';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../models/question.model';
import { ErrorUtils } from '../utils/error.utils';

export class QuestionController {
  
  static async getQuestionsByQuizId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quizId = parseInt(req.params.quizId);
      
      if (isNaN(quizId)) {
        throw ErrorUtils.badRequest('Invalid quiz ID');
      }
      
      const questions = await QuestionService.getQuestionsByQuizId(quizId);
      res.json(questions);
    } catch (error) {
      next(error);
    }
  }

  
  static async getQuestionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      const question = await QuestionService.getQuestionById(id);
      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  
  static async createQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quiz_id, question_text, difficulty_id } = req.body as CreateQuestionDto;
      
      if (!quiz_id) {
        throw ErrorUtils.badRequest('Quiz ID is required');
      }
      
      if (!question_text) {
        throw ErrorUtils.badRequest('Question text is required');
      }
      
      if (question_text.length > 256) {
        throw ErrorUtils.badRequest('Question text cannot exceed 256 characters');
      }
      
      if (!difficulty_id) {
        throw ErrorUtils.badRequest('Difficulty level ID is required');
      }
      
      const data: CreateQuestionDto = {
        quiz_id: parseInt(quiz_id.toString()),
        question_text,
        difficulty_id: parseInt(difficulty_id.toString())
      };
      
      if (isNaN(data.quiz_id)) {
        throw ErrorUtils.badRequest('Quiz ID must be a number');
      }
      
      if (isNaN(data.difficulty_id)) {
        throw ErrorUtils.badRequest('Difficulty ID must be a number');
      }
      
      const question = await QuestionService.createQuestion(data);
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  }

  
  static async updateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      const { question_text, difficulty_id } = req.body as UpdateQuestionDto;
      
      if (question_text === undefined && difficulty_id === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      if (question_text !== undefined && question_text.length > 256) {
        throw ErrorUtils.badRequest('Question text cannot exceed 256 characters');
      }
      
      const data: UpdateQuestionDto = {};
      
      if (question_text !== undefined) {
        data.question_text = question_text;
      }
      
      if (difficulty_id !== undefined) {
        const parsedDifficultyId = parseInt(difficulty_id.toString());
        if (isNaN(parsedDifficultyId)) {
          throw ErrorUtils.badRequest('Difficulty ID must be a number');
        }
        data.difficulty_id = parsedDifficultyId;
      }
      
      const question = await QuestionService.updateQuestion(id, data);
      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  
  static async deleteQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      await QuestionService.deleteQuestion(id);
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  
  static async validateQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      const question = await QuestionService.getQuestionById(id);
      
      const validation = await QuestionService.validateQuestionAnswers(id);
      
      res.json({
        question,
        validation
      });
    } catch (error) {
      next(error);
    }
  }
}