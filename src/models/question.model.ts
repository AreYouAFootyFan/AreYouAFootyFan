import db from '../config/db';

export interface Question {
  question_id: number;
  quiz_id: number;
  question_text: string;
  difficulty_id: number;
}

export interface CreateQuestionDto {
  quiz_id: number;
  question_text: string;
  difficulty_id: number;
}

export interface UpdateQuestionDto {
  question_text?: string;
  difficulty_id?: number;
}

export class QuestionModel {
  
  static async findByQuizId(quizId: number): Promise<Question[]> {
    const result = await db.query(
      'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY question_id',
      [quizId]
    );
    return result.rows;
  }

  
  static async findById(id: number): Promise<Question | null> {
    const result = await db.query(
      'SELECT * FROM questions WHERE question_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }


  static async create(data: CreateQuestionDto): Promise<Question> {
    const result = await db.query(
      'INSERT INTO questions (quiz_id, question_text, difficulty_id) VALUES ($1, $2, $3) RETURNING *',
      [data.quiz_id, data.question_text, data.difficulty_id]
    );
    
    return result.rows[0];
  }

 
  static async update(id: number, data: UpdateQuestionDto): Promise<Question | null> {
    const question = await this.findById(id);
    
    if (!question) {
      return null;
    }
    
    const result = await db.query(
      'UPDATE questions SET question_text = $1, difficulty_id = $2 WHERE question_id = $3 RETURNING *',
      [
        data.question_text !== undefined ? data.question_text : question.question_text,
        data.difficulty_id !== undefined ? data.difficulty_id : question.difficulty_id,
        id
      ]
    );
    
    return result.rows[0];
  }

  
  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM questions WHERE question_id = $1 RETURNING *',
      [id]
    );
    
    return result.rows.length > 0;
  }

  
  static async findByIdWithDifficulty(id: number): Promise<any | null> {
    const result = await db.query(
      `SELECT q.*, d.difficulty_level, d.time_limit_seconds, d.points_on_correct, d.points_on_incorrect 
       FROM questions q
       JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
       WHERE q.question_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  
  static async findByQuizIdWithDetails(quizId: number): Promise<any[]> {
    const result = await db.query(
      `SELECT q.*, d.difficulty_level, d.time_limit_seconds, d.points_on_correct, d.points_on_incorrect,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id) as answer_count,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.question_id AND is_correct = true) as correct_answer_count
       FROM questions q
       JOIN difficulty_levels d ON q.difficulty_id = d.difficulty_id
       WHERE q.quiz_id = $1
       ORDER BY q.question_id`,
      [quizId]
    );
    
    return result.rows;
  }

  
  static async countAnswers(questionId: number): Promise<number> {
    const result = await db.query(
      'SELECT COUNT(*) FROM answers WHERE question_id = $1',
      [questionId]
    );
    
    return parseInt(result.rows[0].count);
  }

 
  static async countCorrectAnswers(questionId: number): Promise<number> {
    const result = await db.query(
      'SELECT COUNT(*) FROM answers WHERE question_id = $1 AND is_correct = true',
      [questionId]
    );
    
    return parseInt(result.rows[0].count);
  }
}