import { Request, Response, NextFunction } from 'express';
import { UserResponseService } from '../services/user-response.service';
import { CreateUserResponseDto } from '../models/user-response.model';
import { ErrorUtils } from '../utils/error.utils';

export class UserResponseController {
  
  static async getAttemptResponses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const attemptId = parseInt(req.params.attemptId);
      
      if (isNaN(attemptId)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      const responses = await UserResponseService.getAttemptResponses(attemptId);
      res.json(responses);
    } catch (error) {
      next(error);
    }
  }

  
  static async submitResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { attempt_id, question_id, answer_id } = req.body;
      
      if (!attempt_id) {
        throw ErrorUtils.badRequest('Attempt ID is required');
      }
      
      if (!question_id) {
        throw ErrorUtils.badRequest('Question ID is required');
      }
      
      if (!answer_id) {
        throw ErrorUtils.badRequest('Answer ID is required');
      }
      
      const parsedAttemptId = parseInt(attempt_id.toString());
      const parsedQuestionId = parseInt(question_id.toString());
      const parsedAnswerId = parseInt(answer_id.toString());
      
      if (isNaN(parsedAttemptId)) {
        throw ErrorUtils.badRequest('Invalid attempt ID');
      }
      
      if (isNaN(parsedQuestionId)) {
        throw ErrorUtils.badRequest('Invalid question ID');
      }
      
      if (isNaN(parsedAnswerId)) {
        throw ErrorUtils.badRequest('Invalid answer ID');
      }
      
      const data: CreateUserResponseDto = {
        attempt_id: parsedAttemptId,
        question_id: parsedQuestionId,
        answer_id: parsedAnswerId
      };
      
      const response = await UserResponseService.submitResponse(data);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  
  static async getResponseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid response ID');
      }
      
      const response = await UserResponseService.getResponseById(id);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}