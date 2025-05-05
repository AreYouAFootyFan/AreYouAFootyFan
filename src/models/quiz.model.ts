import db from '../config/db';
import { CreateQuizDto, UpdateQuizDto } from '../DTOs/quiz.dto';

export interface Quiz {
  quiz_id: number;
  quiz_title: string;
  quiz_description: string | null;
  category_id: number | null;
  created_by: number;
  created_at: Date;
  deactivated_at: Date | null;
}

export class QuizModel {
 
  static async findAll(): Promise<Quiz[]> {
    const result = await db.query(
      'SELECT * FROM quizzes WHERE deactivated_at IS NULL ORDER BY created_at DESC'
    );
    return result.rows;
  }

  
  static async findByCreator(userId: number): Promise<Quiz[]> {
    const result = await db.query(
      'SELECT * FROM quizzes WHERE created_by = $1 AND deactivated_at IS NULL ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findByCategory(categoryId: number): Promise<Quiz[]> {
    const result = await db.query(
      'SELECT * FROM quizzes WHERE category_id = $1 AND deactivated_at IS NULL ORDER BY created_at DESC',
      [categoryId]
    );
    return result.rows;
  }

  
  static async findById(id: number): Promise<Quiz | null> {
    const result = await db.query(
      'SELECT * FROM quizzes WHERE quiz_id = $1 AND deactivated_at IS NULL',
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
      [data.quiz_title, data.quiz_description || null, data.category_id || null, data.created_by]
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
        data.quiz_description !== undefined ? data.quiz_description : quiz.quiz_description,
        data.category_id !== undefined ? data.category_id : quiz.category_id,
        id
      ]
    );
    
    return result.rows[0];
  }

  
  static async softDelete(id: number): Promise<boolean> {
    const result = await db.query(
      'UPDATE quizzes SET deactivated_at = CURRENT_TIMESTAMP WHERE quiz_id = $1 AND deactivated_at IS NULL RETURNING *',
      [id]
    );
    
    return result.rows.length > 0;
  }

  
  static async findByIdWithCategory(id: number): Promise<any | null> {
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

  
  static async findAllWithCategories(): Promise<any[]> {
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
      'SELECT COUNT(*) FROM questions WHERE quiz_id = $1',
      [quizId]
    );
    
    return parseInt(result.rows[0].count);
  }


  static async hasAttempts(quizId: number): Promise<boolean> {
    const result = await db.query(
      'SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = $1',
      [quizId]
    );
    
    return parseInt(result.rows[0].count) > 0;
  }
}