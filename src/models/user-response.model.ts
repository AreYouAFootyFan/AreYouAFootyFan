import db from "../config/db";
import { CreateUserResponseDto } from "../DTOs/user-response.dto";
import { UserResponse, UserResponseDetails } from "../types/user-response.types";
import { QueryResult } from "pg";

export class UserResponseModel {
  
  static async findByQuestionAndAttempt(
    questionId: number,
    attemptId: number
  ): Promise<UserResponse | null> {
    const result: QueryResult<UserResponse> = await db.query(
      "SELECT * FROM user_responses WHERE question_id = $1 AND attempt_id = $2",
      [questionId, attemptId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByAttemptId(attemptId: number): Promise<UserResponse[]> {
    const result: QueryResult<UserResponse> = await db.query(
      "SELECT * FROM user_responses WHERE attempt_id = $1 ORDER BY question_id",
      [attemptId]
    );

    return result.rows;
  }

  static async create(data: CreateUserResponseDto): Promise<UserResponse> {
     const client = await db.connect();
  
  try {
    await client.query("BEGIN");
    
    const questionResult = await client.query(
      `SELECT q.*, d.points_on_correct, d.points_on_incorrect
       FROM questions q
       JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
       WHERE q.question_id = $1`,
      [data.question_id]
    );

    if (questionResult.rows.length === 0) {
      throw new Error("Question not found");
    }

    const question = questionResult.rows[0];

    const answerResult = await client.query(
      "SELECT * FROM answers WHERE question_id = $1 AND answer_id = $2",
      [data.question_id, data.answer_id]
    );

    if (answerResult.rows.length === 0) {
      throw new Error("Answer not found");
    }

    const answer = answerResult.rows[0];

    const pointsEarned = answer.is_correct
      ? question.points_on_correct
      : question.points_on_incorrect;

    const result = await client.query(
      `INSERT INTO user_responses (attempt_id, question_id, chosen_answer, points_earned) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [data.attempt_id, data.question_id, data.answer_id, pointsEarned]
    );
    
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  }

  static async update(
    responseId: number,
    data: { answer_id: number }
  ): Promise<UserResponse | null> {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const responseResult: QueryResult<UserResponse> = await client.query(
        "SELECT * FROM user_responses WHERE response_id = $1",
        [responseId]
      );

      if (responseResult.rows.length === 0) {
        return null;
      }

      const response = responseResult.rows[0];

      const questionResult: QueryResult<{
        question_id: number;
        points_on_correct: number;
        points_on_incorrect: number;
      }> = await client.query(
        `SELECT q.*, d.points_on_correct, d.points_on_incorrect
         FROM questions q
         JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
         WHERE q.question_id = $1`,
        [response.question_id]
      );

      const question = questionResult.rows[0];

      const answerResult: QueryResult<{
        answer_id: number;
        question_id: number;
        is_correct: boolean;
      }> = await client.query(
        "SELECT * FROM answers WHERE question_id = $1 AND answer_id = $2",
        [response.question_id, data.answer_id]
      );

      if (answerResult.rows.length === 0) {
        throw new Error("Answer not found");
      }

      const answer = answerResult.rows[0];

      const pointsEarned = answer.is_correct
        ? question.points_on_correct
        : question.points_on_incorrect;

      const result: QueryResult<UserResponse> = await client.query(
        "UPDATE user_responses SET chosen_answer = $1, points_earned = $2 WHERE response_id = $3 RETURNING *",
        [data.answer_id, pointsEarned, responseId]
      );

      await client.query("COMMIT");

      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getResponseDetails(responseId: number): Promise<UserResponseDetails | null> {
    const result: QueryResult<UserResponseDetails> = await db.query(
      `SELECT ur.*, q.question_text, a.answer_text, a.is_correct,
        d.difficulty_level, d.points_on_correct, d.points_on_incorrect, d.points_on_no_answer
      FROM user_responses ur
      JOIN questions q ON ur.question_id = q.question_id
      LEFT JOIN answers a ON ur.chosen_answer = a.answer_id
      JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
      WHERE ur.response_id = $1`,
      [responseId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async countByAttemptId(attemptId: number): Promise<number> {
    const result: QueryResult<{ count: string }> = await db.query(
      "SELECT COUNT(*) FROM user_responses WHERE attempt_id = $1",
      [attemptId]
    );

    return parseInt(result.rows[0].count);
  }

  static async getDetailedResponsesByAttemptId(attemptId: number): Promise<UserResponseDetails[]> {
    const result: QueryResult<UserResponseDetails> = await db.query(
      `SELECT ur.*, q.question_text, a.answer_text, a.is_correct,
        d.difficulty_level, d.points_on_correct, d.points_on_incorrect, d.points_on_no_answer
      FROM user_responses ur
      JOIN questions q ON ur.question_id = q.question_id
      LEFT JOIN answers a ON ur.chosen_answer = a.answer_id
      JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
      WHERE ur.attempt_id = $1
      ORDER BY ur.question_id`,
      [attemptId]
    );

    return result.rows;
}
}