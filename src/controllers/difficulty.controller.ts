import { Request, Response, NextFunction } from 'express';
import { DifficultyService } from '../services/difficulty.service';
import { CreateDifficultyLevelDto, UpdateDifficultyLevelDto } from '../models/difficulty.model';
import { ErrorUtils } from '../utils/error.utils';

export class DifficultyController {
  
  static async getAllDifficultyLevels(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const difficultyLevels = await DifficultyService.getAllDifficultyLevels();
      response.json(difficultyLevels);
    } catch (error) {
      next(error);
    }
  }


  static async getDifficultyLevelById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid difficulty level ID');
      }
      
      const difficultyLevel = await DifficultyService.getDifficultyLevelById(id);
      response.json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }

  
  static async createDifficultyLevel(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { difficulty_level, time_limit_seconds, points_on_correct, points_on_incorrect } = request.body as CreateDifficultyLevelDto;
      
      // Validate required fields
      if (!difficulty_level) {
        throw ErrorUtils.badRequest('Difficulty level name is required');
      }
      
      if (difficulty_level.length > 16) {
        throw ErrorUtils.badRequest('Difficulty level name cannot exceed 16 characters');
      }
      
      if (time_limit_seconds === undefined) {
        throw ErrorUtils.badRequest('Time limit is required');
      }
      
      if (points_on_correct === undefined) {
        throw ErrorUtils.badRequest('Points on correct is required');
      }
      
      if (points_on_incorrect === undefined) {
        throw ErrorUtils.badRequest('Points on incorrect is required');
      }
      
      const data: CreateDifficultyLevelDto = {
        difficulty_level,
        time_limit_seconds: parseInt(time_limit_seconds.toString()),
        points_on_correct: parseInt(points_on_correct.toString()),
        points_on_incorrect: parseInt(points_on_incorrect.toString())
      };
      
      if (isNaN(data.time_limit_seconds) || data.time_limit_seconds <= 0) {
        throw ErrorUtils.badRequest('Time limit must be a positive number');
      }
      
      if (isNaN(data.points_on_correct)) {
        throw ErrorUtils.badRequest('Points on correct must be a number');
      }
      
      if (isNaN(data.points_on_incorrect)) {
        throw ErrorUtils.badRequest('Points on incorrect must be a number');
      }
      
      const difficultyLevel = await DifficultyService.createDifficultyLevel(data);
      response.status(201).json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }


  static async updateDifficultyLevel(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid difficulty level ID');
      }
      
      const { difficulty_level, time_limit_seconds, points_on_correct, points_on_incorrect } = request.body as UpdateDifficultyLevelDto;
      
      if (difficulty_level === undefined && 
          time_limit_seconds === undefined && 
          points_on_correct === undefined && 
          points_on_incorrect === undefined) {
        throw ErrorUtils.badRequest('At least one field to update is required');
      }
      
      if (difficulty_level !== undefined && difficulty_level.length > 16) {
        throw ErrorUtils.badRequest('Difficulty level name cannot exceed 16 characters');
      }
      
      const data: UpdateDifficultyLevelDto = {};
      
      if (difficulty_level !== undefined) {
        data.difficulty_level = difficulty_level;
      }
      
      if (time_limit_seconds !== undefined) {
        const parsedTimeLimit = parseInt(time_limit_seconds.toString());
        if (isNaN(parsedTimeLimit) || parsedTimeLimit <= 0) {
          throw ErrorUtils.badRequest('Time limit must be a positive number');
        }
        data.time_limit_seconds = parsedTimeLimit;
      }
      
      if (points_on_correct !== undefined) {
        const parsedPointsOnCorrect = parseInt(points_on_correct.toString());
        if (isNaN(parsedPointsOnCorrect)) {
          throw ErrorUtils.badRequest('Points on correct must be a number');
        }
        data.points_on_correct = parsedPointsOnCorrect;
      }
      
      if (points_on_incorrect !== undefined) {
        const parsedPointsOnIncorrect = parseInt(points_on_incorrect.toString());
        if (isNaN(parsedPointsOnIncorrect)) {
          throw ErrorUtils.badRequest('Points on incorrect must be a number');
        }
        data.points_on_incorrect = parsedPointsOnIncorrect;
      }
      
      const difficultyLevel = await DifficultyService.updateDifficultyLevel(id, data);
      response.json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }


  static async deleteDifficultyLevel(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(request.params.id);
      
      if (isNaN(id)) {
        throw ErrorUtils.badRequest('Invalid difficulty level ID');
      }
      
      await DifficultyService.deleteDifficultyLevel(id);
      response.json({ message: 'Difficulty level deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}