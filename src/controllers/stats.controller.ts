import { Request, Response, NextFunction } from "express";
import { StatsService } from "../services/stats.service";

export class StatsController {
  static async getDashboardStats(
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await StatsService.getDashboardStats();
      response.json(stats);
    } catch (error) {
      next(error);
    }
  }
}
