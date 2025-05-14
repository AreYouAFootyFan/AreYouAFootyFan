import db from "../config/db";
import { ErrorUtils } from "../utils/error.utils";
import { Message } from "../utils/enums";

export interface DashboardStats {
  active_quizzes: number;
  registered_players: number;
  quizzes_completed: number;
  questions_answered: number;
}

export interface PlayerTopCategories{
    name: string,
    accuracy: number
}

export interface ManagerTopCategories{
    name: string,
    count: number
}

export interface PlayerProfileStats {
    elo: number,
    quizzesCompleted: number,
    avgScore: number,
    rank: number
    topCategories: PlayerTopCategories[],
    badges: string[]
}

export interface ManagerProfileStats {
    quizzesCreated: number,
    quizAttempts: number,
    avgScore: number,
    rank: number
    topCategories: ManagerTopCategories[]
    // badges: string[]
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

  static async getPlayerProfileStats(userId: number): Promise<PlayerProfileStats> {
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

        const topCategoriesResult = await db.query("SELECT * FROM get_user_top_categories($1)", [
            userId,
        ]);

        const topCategories: PlayerTopCategories[] = [];

        topCategoriesResult.rows.forEach(category => {
            const topCategory = {
                name: category.category_name,
                accuracy: category.accuracy_rate * 100
            };

            topCategories.push(topCategory);
        });

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
            topCategories: topCategories,
            badges: badgesEarned
        }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }

    static async getManagerProfileStats(userId: number): Promise<ManagerProfileStats> {
    try {
        const quizzes_created = await db.query("SELECT COUNT(*) as created FROM get_quizzes_created_by_manager($1);", [
            userId,
        ]);

        const rank = 0;

        const quiz_attempts = await db.query("SELECT SUM(attempt_count) AS quiz_attempts FROM get_manager_quiz_attempts($1)", [
            userId,
        ]);

        const avgScore = await db.query("SELECT AVG(avg_accuracy) AS accuracy FROM get_manager_quizzes_accuracy($1);", [
            userId,
        ]);

        const topCategoriesResult = await db.query("SELECT * FROM get_manager_top_categories($1)", [
            userId,
        ]);

        const topCategories: ManagerTopCategories[] = [];

        topCategoriesResult.rows.forEach(category => {
            const topCategory = {
                name: category.category_name,
                count: category.quiz_count
            };

            topCategories.push(topCategory);
        });

        const accuracyResult = avgScore.rows[0].accuracy;
        let accuracy = 0;
        if(accuracyResult != null){
            accuracy = Math.round(parseFloat(accuracyResult) * 100 * 100) / 100;
        }
        
        return {
            quizzesCreated: parseInt(quizzes_created.rows[0].created),
            rank: rank,
            quizAttempts: quiz_attempts.rows[0].quiz_attempts != null ? parseInt(quiz_attempts.rows[0].quiz_attempts) : 0,
            avgScore: accuracy,
            topCategories: topCategories,
        }

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw ErrorUtils.internal(Message.Error.Base.INTERNAL_SERVER_ERROR);
    }
  }
}
