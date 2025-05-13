import db from "../config/db";
import { CreateAnswerDto, UpdateAnswerDto } from "../DTOs/answer.dto";

export interface Answer {
  answer_id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
}

export class AnswerModel {
  static async findByQuestionId(questionId: number): Promise<Answer[]> {
    const result = await db.query(
      "SELECT answer_id, answer_text, is_correct FROM get_answers($1)",
      [questionId]
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Answer | null> {
    const result = await db.query(
      "SELECT answer_id, answer_text, is_correct, question_id FROM answers WHERE answer_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(data: CreateAnswerDto): Promise<Answer> {
    const result = await db.query(
      "INSERT INTO answers (question_id, answer_text, is_correct) VALUES ($1, $2, $3) RETURNING *",
      [data.question_id, data.answer_text, data.is_correct]
    );

    return result.rows[0];
  }

  static async update(
    id: number,
    data: UpdateAnswerDto
  ): Promise<Answer | null> {
    const answer = await this.findById(id);

    if (!answer) {
      return null;
    }

    const result = await db.query(
      "UPDATE answers SET answer_text = $1, is_correct = $2 WHERE answer_id = $3 RETURNING *",
      [
        data.answer_text !== undefined ? data.answer_text : answer.answer_text,
        data.is_correct !== undefined ? data.is_correct : answer.is_correct,
        id,
      ]
    );

    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      "DELETE FROM answers WHERE answer_id = $1 RETURNING *",
      [id]
    );

    return result.rows.length > 0;
  }

  static async markAsCorrect(
    answerId: number,
    questionId: number
  ): Promise<void> {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE answers SET is_correct = false WHERE question_id = $1",
        [questionId]
      );

      await client.query(
        "UPDATE answers SET is_correct = true WHERE answer_id = $1",
        [answerId]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async findCorrectAnswer(questionId: number): Promise<Answer | null> {
    const result = await db.query(
      "SELECT * FROM answers WHERE question_id = $1 AND is_correct = true",
      [questionId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}
