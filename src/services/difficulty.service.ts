import {
  DifficultyLevelModel,
  DifficultyLevel,
} from "../models/difficulty.model";
import {
  CreateDifficultyLevelDto,
  UpdateDifficultyLevelDto,
} from "../DTOs/difficulty.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export class DifficultyService {
  static async getAllDifficultyLevels(): Promise<DifficultyLevel[]> {
    return DifficultyLevelModel.findAll();
  }

  static async getDifficultyLevelById(id: number): Promise<DifficultyLevel> {
    const difficultyLevel = await DifficultyLevelModel.findById(id);

    if (!difficultyLevel) {
      throw ErrorUtils.notFound(Message.Error.Difficulty.NOT_FOUND);
    }

    return difficultyLevel;
  }

  static async createDifficultyLevel(
    data: CreateDifficultyLevelDto
  ): Promise<DifficultyLevel> {
    if (data.time_limit_seconds <= 0) {
      throw ErrorUtils.badRequest(Message.Error.Difficulty.TIME_LIMIT_POSITIVE);
    }

    const existingLevel = await DifficultyLevelModel.findByName(
      data.difficulty_level
    );

    if (existingLevel) {
      throw ErrorUtils.conflict(Message.Error.Difficulty.NAME_EXISTS);
    }

    return DifficultyLevelModel.create(data);
  }

  static async updateDifficultyLevel(
    id: number,
    data: UpdateDifficultyLevelDto
  ): Promise<DifficultyLevel> {
    // Validate data
    if (data.time_limit_seconds !== undefined && data.time_limit_seconds <= 0) {
      throw ErrorUtils.badRequest(Message.Error.Difficulty.TIME_LIMIT_POSITIVE);
    }

    const existingLevel = await DifficultyLevelModel.findById(id);

    if (!existingLevel) {
      throw ErrorUtils.notFound(Message.Error.Difficulty.NOT_FOUND);
    }

    if (
      data.difficulty_level &&
      data.difficulty_level !== existingLevel.difficulty_level
    ) {
      const levelWithSameName = await DifficultyLevelModel.findByName(
        data.difficulty_level
      );

      if (levelWithSameName) {
        throw ErrorUtils.conflict(Message.Error.Difficulty.NAME_EXISTS_OTHER);
      }
    }

    const updatedLevel = await DifficultyLevelModel.update(id, data);

    if (!updatedLevel) {
      throw ErrorUtils.internal(Message.Error.Difficulty.UPDATE_FAILED);
    }

    return updatedLevel;
  }

  static async deleteDifficultyLevel(id: number): Promise<void> {
    const existingLevel = await DifficultyLevelModel.findById(id);

    if (!existingLevel) {
      throw ErrorUtils.notFound(Message.Error.Difficulty.NOT_FOUND);
    }

    const isUsed = await DifficultyLevelModel.isUsedByQuestions(id);

    if (isUsed) {
      throw ErrorUtils.badRequest(Message.Error.Difficulty.USED_BY_QUESTIONS);
    }

    const deleted = await DifficultyLevelModel.delete(id);

    if (!deleted) {
      throw ErrorUtils.internal(Message.Error.Difficulty.DELETE_FAILED);
    }
  }
}
