import { Request, Response, NextFunction } from 'express';
import { AnswerService } from '../services/answer.service';
import { CreateAnswerDto, UpdateAnswerDto } from '../models/answer.model';
import { ErrorUtils } from '../utils/error.utils';

export class AnswerController {
  
  static async getAnswersByQuestionId(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const questionId = parseInt(request.params.questionId);
      
      if (isNaN(questionId)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      const answers = await AnswerService.getAnswersByQuestionId(questionId);
      response.json(answers);
    } catch (error) {
      next(error);
    }
  }

  
  static async getAnswerById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid answer ID');
      }
      
      const answer = await AnswerService.getAnswerById(id);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }

  
  static async createAnswer(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { question_id, answer_text, is_correct } = request.body as CreateAnswerDto;
      
      if (!question_id) {
        throw ErrorUtils.badRequest('Question ID is required');
      }
      
      if (!answer_text) {
        throw ErrorUtils.badRequest('Answer text is required');
      }
      
      if (answer_text.length > 128) {
        throw ErrorUtils.badRequest('Answer text cannot exceed 128 characters');
      }
      
      if (is_correct === undefined) {
        throw ErrorUtils.badRequest('is_correct flag is required');
      }
      
      const data: CreateAnswerDto = {
        question_id: parseInt(question_id.toString()),
        answer_text,
        is_correct: Boolean(is_correct)
      };
      
      if (isNaN(data.question_id)) {
        throw ErrorUtils.badRequest('Question ID must be a number');
      }
      
      const answer = await AnswerService.createAnswer(data);
      response.status(201).json(answer);
    } catch (error) {
      next(error);
    }
  }

  
  static async updateAnswer(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid answer ID');
      }
      
      const { answer_text, is_correct } = request.body as UpdateAnswerDto;
      
      if (answer_text === undefined && is_correct === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      if (answer_text !== undefined && answer_text.length > 128) {
        throw ErrorUtils.badRequest('Answer text cannot exceed 128 characters');
      }
      
      const data: UpdateAnswerDto = {};
      
      if (answer_text !== undefined) {
        data.answer_text = answer_text;
      }
      
      if (is_correct !== undefined) {
        data.is_correct = Boolean(is_correct);
      }
      
      const answer = await AnswerService.updateAnswer(id, data);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }

  
  static async deleteAnswer(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid answer ID');
      }
      
      await AnswerService.deleteAnswer(id);
      response.json({ message: 'Answer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  
  static async markAsCorrect(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid answer ID');
      }
      
      const answer = await AnswerService.markAsCorrect(id);
      response.json(answer);
    } catch (error) {
      next(error);
    }
  }
}