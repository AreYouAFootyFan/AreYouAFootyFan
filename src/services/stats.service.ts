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
    rank: number
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
        const elo = await db.query("SELECT * FROM get_total_points($1)", [
            userId,
        ]);

        const rank = await db.query("SELECT * FROM get_user_rank($1)", [
            userId,
        ]);


        const quizzes_completed = await db.query("SELECT * FROM get_num_quizzes_done($1)", [
            userId,
        ]);

        const avgScore = await db.query("SELECT * FROM get_accuracy_rate($1)", [
            userId,
        ]);

        const top_categories = ['La Liga', ];
        const badges = await db.query("SELECT * FROM get_badges($1)", [
            userId,
        ]);
        
        const badgesEarned: string[] = [];

        badges.rows.forEach(badge => {
            badgesEarned.push(badge.badge_name);
        });

        const accuracy = Math.round(parseFloat(avgScore.rows[0].get_accuracy_rate) * 100 * 100) / 100;


        return {
            elo: parseInt(elo.rows[0].get_total_points),
            rank: parseInt(rank.rows[0].get_user_rank),
            quizzesCompleted: parseInt(quizzes_completed.rows[0].get_num_quizzes_done),
            avgScore: accuracy,
            topCategories: top_categories,
            badges: badgesEarned
        }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }
}
