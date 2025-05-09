/**
 * Re-export all error enums
 */
import * as Length from './length/index';
export { Length };

/**
 * Base error messages used throughout the application
 */
export enum BaseError {
  UNAUTHORIZED = "Authentication token is required",
  USER_NOT_AUTHENTICATED = "User not authenticated",
  BAD_REQUEST = "Bad request",
  FORBIDDEN = "Forbidden",
  NOT_FOUND = "Not found",
  CONFLICT = "Conflict",
  INTERNAL_SERVER_ERROR = "Internal server error",
  INVALID_LIMIT = "Invalid limit parameter",
}

/**
 * Auth-related error messages
 */
export enum AuthError {
  GOOGLE_CODE_REQUIRED = "Google code is required",
}

/**
 * Quiz-related error messages
 */
export enum QuizError {
  NOT_FOUND = "Quiz not found",
  INSUFFICIENT_QUESTIONS = "Quiz does not have enough questions (minimum 5 required)",
  INVALID_QUESTIONS = "Quiz has invalid questions (each question must have exactly 4 answers with 1 correct)",
  HAS_ATTEMPTS = "Cannot delete quiz as it has active attempts",
  QUESTION_NOT_BELONG = "Question does not belong to the current quiz",
  UPDATE_FAILED = "Failed to update quiz",
  DELETE_FAILED = "Failed to delete quiz",
}

/**
 * Question-related error messages
 */
export enum QuestionError {
  NOT_FOUND = "Question not found",
  ID_REQUIRED = "Question ID is required",
  ID_NAN = "Question ID must be a number",
  INVALID_ID = "Invalid Question ID",
  UPDATE_FAILED = "Failed to update question",
  DELETE_FAILED = "Failed to delete question",
}

/**
 * Answer-related error messages
 */
export enum AnswerError {
  NOT_FOUND = "Answer not found",
  TEXT_REQUIRED = "Answer text is required",
  INVALID_ID = "Invalid Answer ID",
  IS_CORRECT_REQUIRED = "`is_correct` flag is required",
  NOT_BELONG_TO_QUESTION = "Answer does not belong to the question",
  UPDATE_FAILED = "Failed to update answer",
  DELETE_FAILED = "Failed to delete answer",
}

/**
 * Quiz attempt-related error messages
 */
export enum AttemptError {
  NOT_FOUND = "Quiz attempt not found",
  COMPLETED = "Quiz attempt is already completed",
  NO_ACCESS = "You do not have permission to access this attempt",
}

/**
 * Category-related error messages
 */
export enum CategoryError {
  NOT_FOUND = "Category not found",
  INVALID = "Invalid category ID",
  NAME_REQUIRED = "Category name is required",
  NAME_EXISTS = "A category with this name already exists",
  UPDATE_FAILED = "Failed to update category",
  DELETE_FAILED = "Failed to delete category",
}

/**
 * Permission-related error messages
 */
export enum PermissionError {
  USERNAME_REQUIRED = "Username is required to access this resource",
  NO_FIELD_TO_UPDATE = "At least one field to update is required",
}

/**
 * Player and manager role-specific error messages
 */
export enum RoleError {
  FORBIDDEN_PLAYER = "Only Players can submit responses",
  FORBIDDEN_MANAGER = "Only Managers can create quizzes",
}

/**
 * Token-related error messages
 */
export enum TokenError {
  INVALID_FORMAT = "Invalid token format",
  INVALID_TOKEN = "Invalid Google token",
  MISSING_USER_ID = "Invalid Google token: missing user ID",
  EXPIRED = "Invalid or expired token",
}

/**
 * Response-related error messages
 */
export enum ResponseError {
  NOT_FOUND = "Response not found",
  UPDATE_FAILED = "Failed to update response",
}

/**
 * User-related error messages
 */
export enum UserError {
  GOOGLE_ID_EXISTS = "User with this Google ID already exists",
  USERNAME_TAKEN = "Username already taken",
  UPDATE_FAILED = "Failed to update user",
  DEACTIVATE_FAILED = "Failed to deactivate user",
}

/**
 * Leaderboard-related error messages
 */
export enum LeaderboardError {
  FETCH_RANK_FAILED = "Failed to fetch user rank",
  FETCH_TOP_FAILED = "Failed to fetch top players",
}

/**
 * Difficulty-related error messages
 */
export enum DifficultyError {
  UPDATE_FAILED = "Failed to update difficulty level",
  DELETE_FAILED = "Failed to delete difficulty level",
} 