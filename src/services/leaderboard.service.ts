import db from "../config/db";
import { ErrorUtils } from "../utils/error.utils";
import { Config, Message } from "../utils/enums";

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  total_points: number;
  quizzes_taken?: number;
  rank?: number;
}

export class LeaderboardService {
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const result = await db.query("SELECT * FROM leaderboard");

      return result.rows.map((row, index) => ({
        ...row,
        rank: index + 1,
        quizzes_taken: 0,
      }));
    } catch (error) {
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }

  static async getUserRank(
    userId: number
  ): Promise<{ rank: number; total_points: number }> {
    try {
      const result = await db.query("SELECT * FROM get_user_rank($1)", [
        userId,
      ]);

      if (result.rows.length === 0) {
        return { rank: 0, total_points: 0 };
      }

      const points = await db.query("SELECT * FROM get_total_points($1)", [
        userId,
      ]);

      return {
        rank: parseInt(result.rows[0].get_user_rank),
        total_points: parseInt(points.rows[0].get_total_points),
      };
    } catch (error) {
      throw ErrorUtils.internal("Failed to fetch user rank");
    }
  }

  static async getTopPlayers(
    limit: number = Config.Value.DEFAULT_LEADERBOARD_LIMIT
  ): Promise<LeaderboardEntry[]> {
    try {
      const result = await db.query(
        `
        SELECT l.user_id, l.username, l.total_points,
               COUNT(DISTINCT qa.quiz_id) as quizzes_taken
        FROM leaderboard l
        LEFT JOIN quiz_attempts qa ON l.user_id = qa.user_id
        GROUP BY l.user_id, l.username, l.total_points
        ORDER BY l.total_points DESC
        LIMIT $1
      `,
        [limit]
      );

      return result.rows.map((row, index) => ({
        ...row,
        rank: index + 1,
        quizzes_taken: parseInt(row.quizzes_taken),
      }));
    } catch (error) {
      throw ErrorUtils.internal("Failed to fetch top players");
    }
  }
}
