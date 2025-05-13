import { Request, Response, NextFunction } from "express";
import { DifficultyService } from "../services/difficulty.service";
import {
  CreateDifficultyLevelDto,
  UpdateDifficultyLevelDto,
} from "../DTOs/difficulty.dto";
import { ErrorUtils } from "../utils/error.utils";
import { Message, Http } from "../utils/enums";

export class DifficultyController {
  static async getAllDifficultyLevels(
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const difficultyLevels = await DifficultyService.getAllDifficultyLevels();
      response.json(difficultyLevels);
    } catch (error) {
      next(error);
    }
  }

  static async getDifficultyLevelById(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.INVALID_ID);
      }

      const difficultyLevel = await DifficultyService.getDifficultyLevelById(
        id
      );
      response.json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }

  static async createDifficultyLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        difficulty_level,
        time_limit_seconds,
        points_on_correct,
        points_on_incorrect,
      } = request.body as CreateDifficultyLevelDto;

      if (!difficulty_level) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.LEVEL_REQUIRED);
      }

      if (difficulty_level.length > 16) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.LEVEL_TOO_LONG);
      }

      if (time_limit_seconds === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.TIME_LIMIT_REQUIRED
        );
      }

      if (points_on_correct === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.POINTS_CORRECT_REQUIRED
        );
      }

      if (points_on_incorrect === undefined) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.POINTS_INCORRECT_REQUIRED
        );
      }

      const data: CreateDifficultyLevelDto = {
        difficulty_level,
        time_limit_seconds: parseInt(time_limit_seconds.toString()),
        points_on_correct: parseInt(points_on_correct.toString()),
        points_on_incorrect: parseInt(points_on_incorrect.toString()),
      };

      if (isNaN(data.time_limit_seconds) || data.time_limit_seconds <= 0) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.TIME_LIMIT_POSITIVE
        );
      }

      if (isNaN(data.points_on_correct)) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.POINTS_CORRECT_NUMBER
        );
      }

      if (isNaN(data.points_on_incorrect)) {
        throw ErrorUtils.badRequest(
          Message.Error.Difficulty.POINTS_INCORRECT_NUMBER
        );
      }

      const difficultyLevel = await DifficultyService.createDifficultyLevel(
        data
      );
      response.status(Http.Status.CREATED).json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }

  static async updateDifficultyLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.INVALID_ID);
      }

      const {
        difficulty_level,
        time_limit_seconds,
        points_on_correct,
        points_on_incorrect,
      } = request.body as UpdateDifficultyLevelDto;

      if (
        difficulty_level === undefined &&
        time_limit_seconds === undefined &&
        points_on_correct === undefined &&
        points_on_incorrect === undefined
      ) {
        throw ErrorUtils.badRequest(
          Message.Error.Permission.NO_FIELD_TO_UPDATE
        );
      }

      if (difficulty_level !== undefined && difficulty_level.length > 16) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.LEVEL_TOO_LONG);
      }

      const data: UpdateDifficultyLevelDto = {};

      if (difficulty_level !== undefined) {
        data.difficulty_level = difficulty_level;
      }

      if (time_limit_seconds !== undefined) {
        const parsedTimeLimit = parseInt(time_limit_seconds.toString());
        if (isNaN(parsedTimeLimit) || parsedTimeLimit <= 0) {
          throw ErrorUtils.badRequest(
            Message.Error.Difficulty.TIME_LIMIT_POSITIVE
          );
        }
        data.time_limit_seconds = parsedTimeLimit;
      }

      if (points_on_correct !== undefined) {
        const parsedPointsOnCorrect = parseInt(points_on_correct.toString());
        if (isNaN(parsedPointsOnCorrect)) {
          throw ErrorUtils.badRequest(
            Message.Error.Difficulty.POINTS_CORRECT_NUMBER
          );
        }
        data.points_on_correct = parsedPointsOnCorrect;
      }

      if (points_on_incorrect !== undefined) {
        const parsedPointsOnIncorrect = parseInt(
          points_on_incorrect.toString()
        );
        if (isNaN(parsedPointsOnIncorrect)) {
          throw ErrorUtils.badRequest(
            Message.Error.Difficulty.POINTS_INCORRECT_NUMBER
          );
        }
        data.points_on_incorrect = parsedPointsOnIncorrect;
      }

      const difficultyLevel = await DifficultyService.updateDifficultyLevel(
        id,
        data
      );
      response.json(difficultyLevel);
    } catch (error) {
      next(error);
    }
  }

  static async deleteDifficultyLevel(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(request.params.id);

      if (isNaN(id)) {
        throw ErrorUtils.badRequest(Message.Error.Difficulty.INVALID_ID);
      }

      await DifficultyService.deleteDifficultyLevel(id);
      response.json({ message: Message.Success.Difficulty.DELETE });
    } catch (error) {
      next(error);
    }
  }
}
