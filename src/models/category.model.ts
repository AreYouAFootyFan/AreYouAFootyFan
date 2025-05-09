import db from "../config/db";
import { CreateCategoryDto, UpdateCategoryDto } from "../DTOs/category.dto";

export interface Category {
  category_id: number;
  category_name: string;
  category_description: string | null;
  deactivated_at: Date | null;
}

export class CategoryModel {
  static async findAll(): Promise<Category[]> {
    const result = await db.query("SELECT * FROM active_categories");
    return result.rows;
  }

  static async findById(id: number): Promise<Category | null> {
    const result = await db.query(
      "SELECT * FROM active_categories WHERE category_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByName(name: string): Promise<Category | null> {
    const result = await db.query(
      "SELECT * FROM active_categories WHERE category_name = $1",
      [name]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(data: CreateCategoryDto): Promise<Category> {
    const result = await db.query(
      "INSERT INTO categories (category_name, category_description) VALUES ($1, $2) RETURNING *",
      [data.category_name, data.category_description || null]
    );

    return result.rows[0];
  }

  static async update(
    id: number,
    data: UpdateCategoryDto
  ): Promise<Category | null> {
    const category = await this.findById(id);

    if (!category) {
      return null;
    }

    const result = await db.query(
      "UPDATE categories SET category_name = $1, category_description = $2 WHERE category_id = $3 RETURNING *",
      [
        data.category_name !== undefined
          ? data.category_name
          : category.category_name,
        data.category_description !== undefined
          ? data.category_description
          : category.category_description,
        id,
      ]
    );

    return result.rows[0];
  }

  static async softDelete(id: number): Promise<boolean> {
    const result = await db.query(
      "UPDATE categories SET deactivated_at = CURRENT_TIMESTAMP WHERE category_id = $1 AND deactivated_at IS NULL RETURNING *",
      [id]
    );

    return result.rows.length > 0;
  }

  static async isUsedByQuizzes(id: number): Promise<boolean> {
    // This will be implemented later when we have the quizzes table
    const result = await db.query(
      "SELECT COUNT(*) FROM quizzes WHERE category_id = $1",
      [id]
    );

    return parseInt(result.rows[0].count) > 0;
  }
}
