import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { ErrorUtils } from '../utils/error.utils';

export class LeaderboardController {
  
  static async getLeaderboard(_request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const leaderboard = await LeaderboardService.getLeaderboard();
      response.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  static async getUserRank(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = request.user?.id;
      
      if (!userId) {
        throw ErrorUtils.unauthorized('User not authenticated');
      }
      
      const userRank = await LeaderboardService.getUserRank(userId);
      response.json(userRank);
    } catch (error) {
      next(error);
    }
  }

  static async getTopPlayers(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const limit = request.query.limit ? parseInt(request.query.limit as string) : 5;
      
      if (isNaN(limit) || limit < 1) {
        throw ErrorUtils.badRequest('Invalid limit parameter');
      }
      
      const topPlayers = await LeaderboardService.getTopPlayers(limit);
      response.json(topPlayers);
    } catch (error) {
      next(error);
    }
  }
}