import db from '../config/db';
import { CreateDifficultyLevelDto, UpdateDifficultyLevelDto } from '../DTOs/difficulty.dto';

export interface DifficultyLevel {
  difficulty_id: number;
  difficulty_level: string;
  time_limit_seconds: number;
  points_on_correct: number;
  points_on_incorrect: number;
}

export class DifficultyLevelModel {
  static async findAll(): Promise<DifficultyLevel[]> {
    const result = await db.query(
      'SELECT * FROM difficulty_levels ORDER BY difficulty_id'
    );
    return result.rows;
  }

  
  static async findById(id: number): Promise<DifficultyLevel | null> {
    const result = await db.query(
      'SELECT * FROM difficulty_levels WHERE difficulty_id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  
  static async findByName(name: string): Promise<DifficultyLevel | null> {
    const result = await db.query(
      'SELECT * FROM difficulty_levels WHERE difficulty_level = $1',
      [name]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  
  static async create(data: CreateDifficultyLevelDto): Promise<DifficultyLevel> {
    const result = await db.query(
      'INSERT INTO difficulty_levels (difficulty_level, time_limit_seconds, points_on_correct, points_on_incorrect) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.difficulty_level, data.time_limit_seconds, data.points_on_correct, data.points_on_incorrect]
    );
    
    return result.rows[0];
  }

  
  static async update(id: number, data: UpdateDifficultyLevelDto): Promise<DifficultyLevel | null> {
    const difficulty = await this.findById(id);
    
    if (!difficulty) {
      return null;
    }
    
    const result = await db.query(
      'UPDATE difficulty_levels SET difficulty_level = $1, time_limit_seconds = $2, points_on_correct = $3, points_on_incorrect = $4 WHERE difficulty_id = $5 RETURNING *',
      [
        data.difficulty_level !== undefined ? data.difficulty_level : difficulty.difficulty_level,
        data.time_limit_seconds !== undefined ? data.time_limit_seconds : difficulty.time_limit_seconds,
        data.points_on_correct !== undefined ? data.points_on_correct : difficulty.points_on_correct,
        data.points_on_incorrect !== undefined ? data.points_on_incorrect : difficulty.points_on_incorrect,
        id
      ]
    );
    
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM difficulty_levels WHERE difficulty_id = $1 RETURNING *',
      [id]
    );
    
    return result.rows.length > 0;
  }


  static async isUsedByQuestions(id: number): Promise<boolean> {
    const result = await db.query(
      'SELECT COUNT(*) FROM questions WHERE difficulty_id = $1',
      [id]
    );
    
    return parseInt(result.rows[0].count) > 0;
  }
}