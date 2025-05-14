import db from "../config/db";
import { CreateCategoryDto, UpdateCategoryDto } from "../DTOs/category.dto";
import { PaginationOptions, PaginatedResponse } from "../types/pagination.types";

export interface Category {
  category_id: number;
  category_name: string;
  category_description?: string;
  deactivated_at?: Date;
}

export class CategoryModel {
  static async findAll(pagination?: PaginationOptions): Promise<PaginatedResponse<Category>> {
    if (pagination) {
      const offset = (pagination.page - 1) * pagination.limit;
      
      const countResult = await db.query(
        "SELECT COUNT(*) FROM active_categories"
      );
      const totalItems = parseInt(countResult.rows[0].count);
      
      const result = await db.query(
        "SELECT * FROM active_categories ORDER BY category_id LIMIT $1 OFFSET $2",
        [pagination.limit, offset]
      );
      
      return {
        data: result.rows,
        pagination: {
          total: totalItems,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(totalItems / pagination.limit)
        }
      };
    }

    // Fallback to non-paginated query
    const result = await db.query("SELECT * FROM active_categories ORDER BY category_id");
    return {
      data: result.rows,
      pagination: {
        total: result.rows.length,
        page: 1,
        limit: result.rows.length,
        totalPages: 1
      }
    };
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
}
