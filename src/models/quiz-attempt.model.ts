import db from "../config/db";
import {
  CreateQuizAttemptDto,
  CompleteQuizAttemptDto,
} from "../DTOs/quiz-attempt.dto";

export interface QuizAttempt {
  attempt_id: number;
  user_id: number;
  quiz_id: number;
  start_time: Date;
  end_time: Date | null;
}

export class QuizAttemptModel {
  static async findByUserId(userId: number): Promise<QuizAttempt[]> {
    const result = await db.query(
      `SELECT qa.*, q.quiz_title, 
        (SELECT COUNT(*) FROM user_responses WHERE attempt_id = qa.attempt_id) as responses_count,
        (SELECT COUNT(*) FROM questions WHERE quiz_id = qa.quiz_id) as questions_count
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.quiz_id
       WHERE qa.user_id = $1
       ORDER BY qa.start_time DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<QuizAttempt | null> {
    const result = await db.query(
      "SELECT * FROM quiz_attempts WHERE attempt_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(data: CreateQuizAttemptDto): Promise<QuizAttempt> {
    const result = await db.query(
      "INSERT INTO quiz_attempts (user_id, quiz_id, start_time) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *",
      [data.user_id, data.quiz_id]
    );

    return result.rows[0];
  }

  static async complete(id: number): Promise<QuizAttempt | null> {
    const result = await db.query(
      "UPDATE quiz_attempts SET end_time = CURRENT_TIMESTAMP WHERE attempt_id = $1 AND end_time IS NULL RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByIdWithDetails(id: number): Promise<any | null> {
    const result = await db.query(
      `SELECT qa.*, q.quiz_title, q.quiz_description, c.category_name,
        (SELECT COUNT(*) FROM user_responses WHERE attempt_id = qa.attempt_id) as responses_count,
        (SELECT COUNT(*) FROM questions WHERE quiz_id = qa.quiz_id) as questions_count,
        (SELECT COALESCE(SUM(points_earned), 0) FROM user_responses WHERE attempt_id = qa.attempt_id) as total_points
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.quiz_id
       LEFT JOIN categories c ON q.category_id = c.category_id
       WHERE qa.attempt_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async getQuizQuestionsWithResponses(
    attemptId: number
  ): Promise<any[]> {
    const result = await db.query(
      `SELECT q.question_id, q.question_text, d.difficulty_level, 
        d.time_limit_seconds, d.points_on_correct, d.points_on_incorrect,
        ur.response_id, ur.chosen_answer as selected_answer_id, ur.points_earned,
        (SELECT json_agg(a.*) FROM answers a WHERE a.question_id = q.question_id) as answers
       FROM quiz_attempts qa
       JOIN quizzes qz ON qa.quiz_id = qz.quiz_id
       JOIN questions q ON qz.quiz_id = q.quiz_id
       JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
       LEFT JOIN user_responses ur ON q.question_id = ur.question_id AND ur.attempt_id = qa.attempt_id
       WHERE qa.attempt_id = $1
       ORDER BY q.question_id`,
      [attemptId]
    );

    return result.rows;
  }

  static async isActive(id: number): Promise<boolean> {
    const result = await db.query(
      "SELECT COUNT(*) FROM quiz_attempts WHERE attempt_id = $1 AND end_time IS NULL",
      [id]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  static async calculateScore(id: number): Promise<number> {
    const result = await db.query(
      "SELECT COALESCE(SUM(points_earned), 0) as total_points FROM user_responses WHERE attempt_id = $1",
      [id]
    );

    return parseInt(result.rows[0].total_points);
  }
}
