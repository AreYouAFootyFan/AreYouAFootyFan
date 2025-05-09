import db from "../config/db";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export interface DashboardStats {
  active_quizzes: number;
  registered_players: number;
  quizzes_completed: number;
  questions_answered: number;
}

export class StatsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const quizzesResult = await db.query(
        "SELECT COUNT(*) FROM active_quizzes"
      );

      const playersResult = await db.query(
        `SELECT COUNT(*) FROM users WHERE role_id = 1 AND deactivated_at IS NULL`
      );

      const completedQuizzesResult = await db.query(
        `SELECT COUNT(*) FROM quiz_attempts WHERE end_time IS NOT NULL`
      );

      const questionsAnsweredResult = await db.query(
        `SELECT COUNT(*) FROM user_responses`
      );

      return {
        active_quizzes: parseInt(quizzesResult.rows[0].count),
        registered_players: parseInt(playersResult.rows[0].count),
        quizzes_completed: parseInt(completedQuizzesResult.rows[0].count),
        questions_answered: parseInt(questionsAnsweredResult.rows[0].count),
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }
}
