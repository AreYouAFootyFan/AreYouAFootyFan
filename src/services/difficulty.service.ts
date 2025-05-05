import { DifficultyLevelModel, DifficultyLevel } from '../models/difficulty.model';
import { CreateDifficultyLevelDto, UpdateDifficultyLevelDto } from '../DTOs/difficulty.dto';
import { ErrorUtils } from '../utils/error.utils';

export class DifficultyService {

  static async getAllDifficultyLevels(): Promise<DifficultyLevel[]> {
    return DifficultyLevelModel.findAll();
  }

  
  static async getDifficultyLevelById(id: number): Promise<DifficultyLevel> {
    const difficultyLevel = await DifficultyLevelModel.findById(id);
    
    if (!difficultyLevel) {
      throw ErrorUtils.notFound('Difficulty level not found');
    }
    
    return difficultyLevel;
  }

  
  static async createDifficultyLevel(data: CreateDifficultyLevelDto): Promise<DifficultyLevel> {
    if (data.time_limit_seconds <= 0) {
      throw ErrorUtils.badRequest('Time limit must be a positive number');
    }

    const existingLevel = await DifficultyLevelModel.findByName(data.difficulty_level);
    
    if (existingLevel) {
      throw ErrorUtils.conflict('A difficulty level with this name already exists');
    }
    
    return DifficultyLevelModel.create(data);
  }

 
  static async updateDifficultyLevel(id: number, data: UpdateDifficultyLevelDto): Promise<DifficultyLevel> {
    // Validate data
    if (data.time_limit_seconds !== undefined && data.time_limit_seconds <= 0) {
      throw ErrorUtils.badRequest('Time limit must be a positive number');
    }

    const existingLevel = await DifficultyLevelModel.findById(id);
    
    if (!existingLevel) {
      throw ErrorUtils.notFound('Difficulty level not found');
    }
    
    if (data.difficulty_level && data.difficulty_level !== existingLevel.difficulty_level) {
      const levelWithSameName = await DifficultyLevelModel.findByName(data.difficulty_level);
      
      if (levelWithSameName) {
        throw ErrorUtils.conflict('Another difficulty level with this name already exists');
      }
    }
    
    const updatedLevel = await DifficultyLevelModel.update(id, data);
    
    if (!updatedLevel) {
      throw ErrorUtils.internal('Failed to update difficulty level');
    }
    
    return updatedLevel;
  }

  
  static async deleteDifficultyLevel(id: number): Promise<void> {
    const existingLevel = await DifficultyLevelModel.findById(id);
    
    if (!existingLevel) {
      throw ErrorUtils.notFound('Difficulty level not found');
    }
    
    const isUsed = await DifficultyLevelModel.isUsedByQuestions(id);
    
    if (isUsed) {
      throw ErrorUtils.badRequest('Cannot delete difficulty level as it is used by existing questions');
    }
    
    const deleted = await DifficultyLevelModel.delete(id);
    
    if (!deleted) {
      throw ErrorUtils.internal('Failed to delete difficulty level');
    }
  }
}