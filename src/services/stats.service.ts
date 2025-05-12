import db from "../config/db";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export interface DashboardStats {
  active_quizzes: number;
  registered_players: number;
  quizzes_completed: number;
  questions_answered: number;
}

export interface ProfileStats {
    elo: number,
    quizzesCompleted: number,
    avgScore: number,
    topCategories: string[],
    badges: string[]
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

  static async getProfileStats(userId: number): Promise<ProfileStats> {
    try {
        const elo = 0;

        const quizzes_completed = await db.query("SELECT * FROM get_num_quizzes_done($1)", [
            userId,
        ]);

        const avgScore = 0;
        const top_categories = ['La Liga'];
        const badges = ['Rookie'];

        return {
            elo: elo,
            quizzesCompleted: parseInt(quizzes_completed.rows[0].get_num_quizzes_done),
            avgScore: avgScore,
            topCategories: top_categories,
            badges: badges
        }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }
}
