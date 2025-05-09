import { Request, Response, NextFunction } from "express";
import { LeaderboardService } from "../services/leaderboard.service";
import { ErrorUtils } from "../utils/error.utils";
import { Config, Message } from "../utils/enums";

export class LeaderboardController {
  static async getLeaderboard(
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard();
      response.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  static async getUserRank(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = request.user?.id;

      if (!userId) {
        throw ErrorUtils.unauthorized(Message.Error.BaseError.USER_NOT_AUTHENTICATED);
      }

      const userRank = await LeaderboardService.getUserRank(userId);
      response.json(userRank);
    } catch (error) {
      next(error);
    }
  }

  static async getTopPlayers(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const limit = request.query.limit
        ? parseInt(request.query.limit as string)
        : Config.Value.DEFAULT_LEADERBOARD_LIMIT;

      if (isNaN(limit) || limit < 1) {
        throw ErrorUtils.badRequest(Message.Error.BaseError.INVALID_LIMIT);
      }

      const topPlayers = await LeaderboardService.getTopPlayers(limit);
      response.json(topPlayers);
    } catch (error) {
      next(error);
    }
  }
}
