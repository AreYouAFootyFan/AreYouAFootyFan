import { Request, Response, NextFunction } from "express";
import { StatsService } from "../services/stats.service";
import { ErrorUtils } from "../utils/error.utils";
import { Config, Message } from "../utils/enums";
import {
  requireRole
} from "../middleware/auth.middleware";
import { User } from "../utils/enums";

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

    static async getProfileStats(
        _request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = _request.user?.id;
            if (!userId) {
                throw ErrorUtils.unauthorized(
                Message.Error.Base.USER_NOT_AUTHENTICATED
                );
            }

            if(_request.user?.role === User.Role.MANAGER){
                const stats = await StatsService.getManagerProfileStats(userId);
                response.json(stats);
            }else{
                const stats = await StatsService.getPlayerProfileStats(userId);
                response.json(stats);
            }
        } catch (error) {
            next(error);
        }
    }
}
