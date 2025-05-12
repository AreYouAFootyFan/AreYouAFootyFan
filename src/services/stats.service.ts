import db from "../config/db";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export interface DashboardStats {
  active_quizzes: number;
  registered_players: number;
  quizzes_completed: number;
  questions_answered: number;
}

export interface UserStats {
  quizzes_done: number;
  questions_answered: number;
  accuracy_rate: number;
  user_rank: number;
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

  static async getUserStats(userId: number): Promise<UserStats> {
    try {
      const quizzesDoneResult = await db.query(
        "SELECT get_num_quizzes_done($1) as quizzes_done",
        [userId]
      );

      const questionsAnsweredResult = await db.query(
        "SELECT get_num_questions_answered($1) as questions_answered",
        [userId]
      );

      const accuracyRateResult = await db.query(
        "SELECT get_accuracy_rate($1) as accuracy_rate",
        [userId]
      );

      const userRankResult = await db.query(
        "SELECT get_user_rank($1) as user_rank",
        [userId]
      );

      return {
        quizzes_done: parseInt(quizzesDoneResult.rows[0].quizzes_done),
        questions_answered: parseInt(questionsAnsweredResult.rows[0].questions_answered),
        accuracy_rate: parseFloat(accuracyRateResult.rows[0].accuracy_rate),
        user_rank: parseInt(userRankResult.rows[0].user_rank),
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }
}
