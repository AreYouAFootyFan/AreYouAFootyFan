import { QueryResult } from "pg";
import db from "../config/db";
import { CreateQuizDto, UpdateQuizDto } from "../DTOs/quiz.dto";
import {
  Quiz,
  QuizWithCategory,
  QuizWithValidation,
} from "../types/quiz.types";
import { Config, User } from "../utils/enums";

export class QuizModel {
  static async findAll(page: number = 1, limit: number = 10): Promise<{ quizzes: Quiz[], total: number }> {
    const offset = (page - 1) * limit;
    
    const countResult = await db.query(
      "SELECT COUNT(*) FROM active_quizzes"
    );
    
    const result = await db.query(
      "SELECT * FROM active_quizzes ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    
    return {
      quizzes: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findByCreator(userId: number): Promise<Quiz[]> {
    const result = await db.query(
      "SELECT * FROM active_quizzes WHERE created_by = $1",
      [userId]
    );
    return result.rows;
  }

  static async findByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<{ quizzes: Quiz[], total: number }> {
    const offset = (page - 1) * limit;
    
    const countResult = await db.query(
      "SELECT COUNT(*) FROM active_quizzes WHERE category_id = $1",
      [categoryId]
    );
    
    const result = await db.query(
      "SELECT * FROM active_quizzes WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
      [categoryId, limit, offset]
    );
    
    return {
      quizzes: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findById(id: number): Promise<Quiz | null> {
    const result = await db.query(
      "SELECT * FROM active_quizzes WHERE quiz_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(data: CreateQuizDto): Promise<Quiz> {
    const result = await db.query(
      `INSERT INTO quizzes 
       (quiz_title, quiz_description, category_id, created_by) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        data.quiz_title,
        data.quiz_description || null,
        data.category_id || null,
        data.created_by,
      ]
    );

    return result.rows[0];
  }

  static async update(id: number, data: UpdateQuizDto): Promise<Quiz | null> {
    const quiz = await this.findById(id);

    if (!quiz) {
      return null;
    }

    const result = await db.query(
      `UPDATE quizzes 
       SET quiz_title = $1, quiz_description = $2, category_id = $3 
       WHERE quiz_id = $4 
       RETURNING *`,
      [
        data.quiz_title !== undefined ? data.quiz_title : quiz.quiz_title,
        data.quiz_description !== undefined
          ? data.quiz_description
          : quiz.quiz_description,
        data.category_id !== undefined ? data.category_id : quiz.category_id,
        id,
      ]
    );

    return result.rows[0];
  }

  static async softDelete(id: number): Promise<boolean> {
    const result = await db.query(
      "UPDATE quizzes SET deactivated_at = CURRENT_TIMESTAMP WHERE quiz_id = $1 AND deactivated_at IS NULL RETURNING *",
      [id]
    );

    return result.rows.length > 0;
  }

  static async findByIdWithCategory(
    id: number
  ): Promise<QuizWithCategory | null> {
    const result = await db.query(
      `SELECT q.*, c.category_name, c.category_description 
       FROM quizzes q
       LEFT JOIN categories c ON q.category_id = c.category_id
       WHERE q.quiz_id = $1 AND q.deactivated_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findAllWithCategories(): Promise<QuizWithCategory[]> {
    const result = await db.query(
      `SELECT q.*, c.category_name, c.category_description 
       FROM quizzes q
       LEFT JOIN categories c ON q.category_id = c.category_id
       WHERE q.deactivated_at IS NULL
       ORDER BY q.created_at DESC`
    );

    return result.rows;
  }

  static async countQuestions(quizId: number): Promise<number> {
    const result = await db.query(
      "SELECT COUNT(*) FROM active_questions WHERE quiz_id = $1",
      [quizId]
    );

    return parseInt(result.rows[0].count);
  }

  static async hasAttempts(quizId: number): Promise<boolean> {
    const result = await db.query(
      "SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = $1",
      [quizId]
    );

    return parseInt(result.rows[0].count) > 0;
  }

  static async findQuizzesWithValidation(options: {
    categoryId?: number;
    minQuestions?: number;
    userId?: number;
    userRole?: string;
  }): Promise<QuizWithValidation[]> {
    const minQuestions =
      options.minQuestions || Config.Value.MIN_QUESTIONS_PER_QUIZ;
    const params: any[] = [minQuestions];
    let paramCounter = 1;

    let query = `
    WITH question_stats AS (
      SELECT 
        q.quiz_id,
        COUNT(q.question_id) AS question_count,
        COUNT(CASE WHEN 
          (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id) = ${Config.Value.DEFAULT_ANSWERS_PER_QUESTION} AND
          (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id AND is_correct = true) = 1
        THEN 1 END) AS valid_question_count
      FROM active_questions q
      GROUP BY q.quiz_id
    )
  `;

    if (options.userId) {
      query += `,
      user_attempts AS (
        SELECT 
          qa.quiz_id,
          BOOL_OR(qa.end_time IS NOT NULL) AS has_completed,
          BOOL_OR(qa.end_time IS NULL) AS in_progress
        FROM quiz_attempts qa
        WHERE qa.user_id = $${++paramCounter}
        GROUP BY qa.quiz_id
      )
    `;
      params.push(options.userId);
    }

    query += `
    SELECT 
      qz.*, 
      c.category_name, 
      c.category_description,
      COALESCE(qs.question_count, 0) AS question_count,
      COALESCE(qs.valid_question_count, 0) AS valid_question_count,
      CASE WHEN COALESCE(qs.valid_question_count, 0) >= $1 AND (valid_question_count = question_count ) THEN true ELSE false END AS is_valid
  `;

    if (options.userId) {
      query += `,
      COALESCE(ua.has_completed, false) AS has_completed,
      COALESCE(ua.in_progress, false) AS in_progress
    `;
    }

    query += `
    FROM quizzes qz
    LEFT JOIN categories c ON qz.category_id = c.category_id
    LEFT JOIN question_stats qs ON qz.quiz_id = qs.quiz_id
  `;

    if (options.userId) {
      query += `
      LEFT JOIN user_attempts ua ON qz.quiz_id = ua.quiz_id
    `;
    }

    query += `
    WHERE qz.deactivated_at IS NULL
  `;

    if (options.categoryId) {
      query += ` AND qz.category_id = $${++paramCounter}`;
      params.push(options.categoryId);
    }

    if (options.userId && options.userRole !== User.Role.MANAGER) {
      query += ` AND COALESCE(ua.has_completed, false) = false`;
    }

    query += ` ORDER BY qz.created_at DESC`;

    const result: QueryResult<any> = await db.query(query, params);
    return result.rows;
  }

  static async findQuizzesWithStats(
    options: {
      categoryId?: number;
      validated?: boolean;
      validationMinQuestions?: number;
      userIdForProgress?: number;
    } = {}
  ): Promise<QuizWithValidation[]> {
    let query = `
      WITH question_stats AS (
        SELECT 
          q.quiz_id,
          COUNT(q.question_id) AS question_count,
          COUNT(CASE WHEN 
            (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id) = 4 AND
            (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id AND is_correct = true) = 1
          THEN 1 END) AS valid_question_count
        FROM active_questions q
        GROUP BY q.quiz_id
      )
      SELECT qz.*, c.category_name, c.category_description, 
        COALESCE(qs.question_count, 0) AS question_count,
        COALESCE(qs.valid_question_count, 0) AS valid_question_count,
        CASE WHEN (COALESCE(qs.valid_question_count, 0) >= $2 AND (valid_question_count = question_count)) THEN true ELSE false END AS is_valid
      FROM active_quizzes qz
      LEFT JOIN categories c ON qz.category_id = c.category_id
      LEFT JOIN question_stats qs ON qz.quiz_id = qs.quiz_id
    `;

    const params: any[] = [options.validationMinQuestions || 5];

    if (options.categoryId) {
      query += ` WHERE qz.category_id = $3`;
      params.push(options.categoryId);
    }

    const result = await db.query(query, params);
    return result.rows;
  }
}
