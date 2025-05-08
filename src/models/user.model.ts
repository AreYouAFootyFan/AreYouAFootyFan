import db from "../config/db";
import { CreateUserDto, UpdateUserDto } from "../DTOs/user.dto";
import { UserRole, ConfigValue } from "../utils/enums";

export interface User {
  user_id: number;
  google_id: string;
  username: string | null;
  role_id: number;
  deactivated_at: Date | null;
}

export class UserModel {
  static async findAll(): Promise<User[]> {
    const result = await db.query(
      "SELECT * FROM users WHERE deactivated_at IS NULL ORDER BY user_id"
    );
    return result.rows;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await db.query(
      "SELECT * FROM users WHERE user_id = $1 AND deactivated_at IS NULL",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByGoogleId(googleId: string): Promise<User | null> {
    const result = await db.query(
      "SELECT * FROM users WHERE google_id = $1 AND deactivated_at IS NULL",
      [googleId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 AND deactivated_at IS NULL",
      [username]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  static async create(data: CreateUserDto): Promise<User> {
    const result = await db.query(
      "INSERT INTO users (google_id, username, role_id) VALUES ($1, $2, $3) RETURNING *",
      [
        data.google_id,
        data.username || null,
        data.role_id || ConfigValue.DEFAULT_ROLE_ID,
      ] // Default role_id for Player
    );

    return result.rows[0];
  }

  static async update(id: number, data: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    const result = await db.query(
      "UPDATE users SET username = $1, role_id = $2 WHERE user_id = $3 RETURNING *",
      [
        data.username !== undefined ? data.username : user.username,
        data.role_id !== undefined ? data.role_id : user.role_id,
        id,
      ]
    );

    return result.rows[0];
  }

  static async deactivate(id: number): Promise<boolean> {
    const result = await db.query(
      "UPDATE users SET deactivated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND deactivated_at IS NULL RETURNING *",
      [id]
    );

    return result.rows.length > 0;
  }

  static async getUserWithRole(id: number): Promise<any | null> {
    const result = await db.query(
      `SELECT u.*, r.role_name
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       WHERE u.user_id = $1 AND u.deactivated_at IS NULL`,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }
}
